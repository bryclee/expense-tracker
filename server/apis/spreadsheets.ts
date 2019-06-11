import express, { RequestHandler } from 'express';

let getSpreadsheetsHandler: RequestHandler;
getSpreadsheetsHandler = function(req, res) {
  res.send('hello');
};

let getEntriesHandler: RequestHandler;
getEntriesHandler = function(req, res) {
  res.send('Goodbye');
}

export function spreadsheetsApi() {
  const router = express.Router();

  router.get('/spreadsheets/:id', getSpreadsheetsHandler);
  router.get('/spreadsheets/:spreadsheetId/entries', getEntriesHandler);

  return router;
}
