import express, { RequestHandler } from 'express';

const accessTokenCheck: RequestHandler = function(req, res, next) {
  if (!req.user.accessToken) {
    res.status(401).send('Missing access token in header');
  }

  next();
}

const getSpreadsheetsHandler: RequestHandler = function(req, res) {
  res.send('hello');
};

const getEntriesHandler: RequestHandler = function(req, res) {
  res.send('Goodbye');
}

export function spreadsheetsApi() {
  const router = express.Router();


  router.use(accessTokenCheck);
  router.get('/spreadsheets', getSpreadsheetsHandler);
  router.get('/spreadsheets/:spreadsheetId/entries', getEntriesHandler);

  return router;
}
