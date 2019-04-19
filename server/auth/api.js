import { GOOGLE_AUTH_HEADER } from '../../shared/constants';
import { getOAuthClient } from './google';

const oauth2Client = getOAuthClient();

async function verifyIdToken(idToken) {
  const ticket = await oauth2Client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();

  return payload;
}

export const headerAuthMiddleware = async (req, res, next) => {
  console.log(req.headers);

  if (!req.headers[GOOGLE_AUTH_HEADER]) {
    return res.status(401).send('Invalid auth header');
  }

  try {
    const payload = await verifyIdToken(req.headers[GOOGLE_AUTH_HEADER]);

    console.log('Payload:', payload);

    next();
  } catch (err) {
    return next(err);
  }
};
