import express, { RequestHandler } from 'express';

let getEntriesHandler: RequestHandler;
getEntriesHandler = function(req, res) {
  res.send('hello');
};

export function entriesApis() {
  const router = express.Router();

  router.get('/entries/:id', getEntriesHandler);

  return router;
}
