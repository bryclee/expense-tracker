import express, { RequestHandler, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import { headerAuthMiddleware } from './auth';
import { spreadsheetsApi } from './apis';
import logger from './logger';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// import { googleRedirectMiddleware } from './auth';

const requestLogger: RequestHandler = function(req, _res, next) {
  logger.info(req);
  next();
};

const notFoundHandler: RequestHandler = function(req, res) {
  logger.warn(req, '404');
  res.status(404).send(404);
};

const errorHandler: ErrorRequestHandler = function(err, req, res) {
  logger.error(req, `500: Request failed with ${err.toString()}`);
  res.status(500).send('Error');
};

app.use(express.static(path.join(process.cwd(), isProd ? 'build' : 'public')));
app.use(bodyParser.json());
app.use(requestLogger);
app.use('/api', headerAuthMiddleware, spreadsheetsApi());
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
