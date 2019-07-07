import express, { RequestHandler, Request } from 'express';
import { google } from 'googleapis';
import { getCredentials } from '../env';

const EXPENSE_TRACKER_SHEET_NAME = 'Hello Expense Tracker';

const DATE_COL = 0;
const NAME_COL = 1;
const CATEGORY_COL = 2;
const AMOUNT_COL = 3;

const accessTokenCheck: RequestHandler = function(req, res, next) {
  if (!req.user.accessToken) {
    res.status(401).send('Missing access token in header');
  }

  next();
};

const getGoogleAuth = function(accessToken) {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = getCredentials();
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
  );

  oauth2Client.setCredentials({ access_token: accessToken });

  return oauth2Client;
};

const getGoogleSheetsApi = function(req: Request) {
  const auth = getGoogleAuth(req.user.accessToken);

  return google.sheets({ version: 'v4', auth });
};

const getSpreadsheetsHandler: RequestHandler = async function(req, res) {
  const api = getGoogleSheetsApi(req);
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const { data } = await api.spreadsheets.get({
    spreadsheetId,
  });
  // TODO: Return this value
  const {
    sheets,
    properties: { title },
  } = data;

  const trackerSheet = sheets.find(sheet =>
    sheet.properties.title.includes(EXPENSE_TRACKER_SHEET_NAME),
  );

  if (!trackerSheet) {
    return res
      .status(404)
      .send(
        `Sheet ${spreadsheetId} does not contain Hello Expense Tracker data`,
      );
  }

  const sheetId = trackerSheet.properties.sheetId;
  const result = [
    {
      id: spreadsheetId,
      name: title,
    },
  ];

  res.send(<SpreadsheetsResponse>result);
};

const getEntriesHandler: RequestHandler = async function(req, res) {
  const { spreadsheetId } = req.params;
  const api = getGoogleSheetsApi(req);
  const { data } = await api.spreadsheets.get({
    spreadsheetId,
  });

  const { sheets } = data;

  const trackerSheet = sheets.find(sheet =>
    sheet.properties.title.includes(EXPENSE_TRACKER_SHEET_NAME),
  );

  if (!trackerSheet) {
    return res
      .status(404)
      .send(
        `Sheet ${spreadsheetId} does not contain Hello Expense Tracker data`,
      );
  }

  const { title } = trackerSheet.properties;

  const { data: entries } = await api.spreadsheets.values.get({
    spreadsheetId,
    range: `${title}!A:D`,
  });

  const result = entries.values.slice(1).map((entry, index) => {
    return {
      id: index.toString(),
      name: entry[NAME_COL],
      date: entry[DATE_COL],
      category: entry[CATEGORY_COL],
      amount: entry[AMOUNT_COL],
    };
  });

  res.send(<EntriesResponse>result);
};

const addEntryHandler: RequestHandler = async function(req, res) {};

export function spreadsheetsApi() {
  const router = express.Router();

  router.use(accessTokenCheck);
  router.get('/spreadsheets', getSpreadsheetsHandler);
  router.get('/spreadsheets/:spreadsheetId/entries', getEntriesHandler);
  router.post('/spreadsheet/:spreadsheetId/entries', addEntryHandler);

  return router;
}
