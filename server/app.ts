import express, { RequestHandler, ErrorRequestHandler } from 'express';
import * as path from 'path';
import { headerAuthMiddleware } from './auth';
import { spreadsheetsApi } from './apis';
import logger from './logger';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// import { googleRedirectMiddleware } from './auth';

const requestLogger: RequestHandler = function(req, _res, next) {
  logger.info(`[Request: ${req.originalUrl}]`);
  next();
};

const notFoundHandler: RequestHandler = function(req, res) {
  logger.warn(`[404: ${req.originalUrl}]`);
  res.status(404).send(404);
};

const errorHandler: ErrorRequestHandler = function(err, req, res) {
  logger.error(
    `[500: ${req.originalUrl}] Request failed with ${err.toString()}`,
  );
  res.status(500).send('Error');
};

app.use(express.static(path.join(process.cwd(), isProd ? 'build' : 'public')));
app.use(requestLogger);
app.use('/api', headerAuthMiddleware, spreadsheetsApi());
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
