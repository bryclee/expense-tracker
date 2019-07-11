import { Request } from 'express';

const buildLog = function(req: Request): string {
  return `[${req.method}: ${req.originalUrl}]`;
};

export default {
  info(req: Request, ...args: any[]) {
    console.log(buildLog(req), ...args);
  },
  warn(req: Request, ...args: any[]) {
    console.warn(buildLog(req), ...args);
  },
  error(req: Request, ...args: any[]) {
    console.error(buildLog(req), ...args);
  },
};
