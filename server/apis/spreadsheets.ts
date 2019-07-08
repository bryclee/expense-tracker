import express, { RequestHandler, Request } from 'express';
import { google, sheets_v4 } from 'googleapis';
import { getCredentials } from '../env';

const EXPENSE_TRACKER_SHEET_NAME = 'Hello Expense Tracker';

const DATE_COL = 0;
const NAME_COL = 1;
const CATEGORY_COL = 2;
const AMOUNT_COL = 3;
const NUM_COLS = 4;

// These are 0-indexed
const START_ROW = 1;
const START_COL = 0;

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

const getGoogleSheetsApi = function(req: Request): sheets_v4.Sheets {
  const auth = getGoogleAuth(req.user.accessToken);

  return google.sheets({ version: 'v4', auth });
};

const getSheetFromSpreadsheetId = async function(
  api: sheets_v4.Sheets,
  spreadsheetId: string,
): Promise<sheets_v4.Schema$Sheet | null> {
  const { data } = await api.spreadsheets.get({
    spreadsheetId,
  });
  const { sheets } = data;

  const trackerSheet = sheets.find(sheet =>
    sheet.properties.title.includes(EXPENSE_TRACKER_SHEET_NAME),
  );

  return trackerSheet || null;
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
  const trackerSheet = await getSheetFromSpreadsheetId(api, spreadsheetId);

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

function formatCellValues(values: string[]): sheets_v4.Schema$CellData[] {
  return values.map(value => {
    return {
      userEnteredValue: {
        stringValue: value,
      },
    };
  });
}

const addEntryHandler: RequestHandler = async function(req, res) {
  const { spreadsheetId } = req.params;
  const api = getGoogleSheetsApi(req);
  const payload: AddEntryPayload = req.body;
  const { date, name, amount, category } = payload;
  const trackerSheet = await getSheetFromSpreadsheetId(api, spreadsheetId);
  const { sheetId } = trackerSheet.properties;
  const values = formatCellValues([date, name, category, amount]);
  const range = {
    sheetId,
    startRowIndex: START_ROW,
    startColumnIndex: START_COL,
    endRowIndex: START_ROW + 1,
    endColumnIndex: START_COL + NUM_COLS,
  };

  await api.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          insertRange: {
            range,
            shiftDimension: 'ROWS',
          },
        },
        {
          updateCells: {
            rows: [
              {
                values,
              },
            ],
            fields: '*',
            range,
          },
        },
      ],
    },
  });

  res.status(200).end();
};

export function spreadsheetsApi() {
  const router = express.Router();

  router.use(accessTokenCheck);
  router.get('/spreadsheets', getSpreadsheetsHandler);
  router.get('/spreadsheets/:spreadsheetId/entries', getEntriesHandler);
  router.post('/spreadsheets/:spreadsheetId/entries', addEntryHandler);

  return router;
}
