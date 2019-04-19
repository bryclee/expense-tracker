import { GOOGLE_AUTH_HEADER, GOOGLE_AT_HEADER } from '../../shared/constants';
import { getOAuthClient } from './google';

const oauth2Client = getOAuthClient();

async function verifyIdToken(idToken: string) {
  const ticket = await oauth2Client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();

  return payload;
}

interface User {
  accountNumber: string;
  accessToken?: string;
}

export interface AppRequest extends Request {
  user?: User
}

export const headerAuthMiddleware = async (req: AppRequest, res, next) => {
  if (!req.headers[GOOGLE_AUTH_HEADER]) {
    return res.status(401).send('Invalid auth header');
  }

  try {
    const payload = await verifyIdToken(req.headers[GOOGLE_AUTH_HEADER]);
    const { sub: accountNumber } = payload;
    const accessToken = req.headers[GOOGLE_AT_HEADER];

    req.user = {
      accountNumber,
      accessToken
    };

    next();
  } catch (err) {
    return next(err);
  }
};
