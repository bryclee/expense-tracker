import { RequestHandler } from 'express';

interface AsyncFunction {
  (...args: any[]): Promise<any>;
}

export default function asyncMiddleware<T extends AsyncFunction>(
  fn: T,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
}
