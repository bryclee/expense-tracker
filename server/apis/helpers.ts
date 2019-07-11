import { RequestHandler } from 'express';
import jsonschema, { Schema } from 'jsonschema';
import logger from '../logger';

interface AsyncFunction {
  (...args: any[]): Promise<any>;
}

export function asyncMiddleware<T extends AsyncFunction>(
  fn: T,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
}

export function validateRequestMiddleware(schema: Schema): RequestHandler {
  return (req, res, next) => {
    const result = jsonschema.validate(req, schema);

    if (!result.valid) {
      logger.warn(
        req,
        'Invalid request:',
        result.errors.map(err => err.toString()),
      );
      res.status(400).send(result.errors.map(err => err.toString()));
    }

    next();
  };
}
