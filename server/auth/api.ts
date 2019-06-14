import { GOOGLE_AUTH_HEADER, GOOGLE_AT_HEADER } from '../../shared/constants'
import { getOAuthClient } from './google'
import { RequestHandler } from 'express'

const oauth2Client = getOAuthClient()

async function verifyIdToken(idToken: string) {
  const ticket = await oauth2Client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()

  return payload
}

export const headerAuthMiddleware: RequestHandler = async (req, res, next) => {
  if (!req.get(GOOGLE_AUTH_HEADER)) {
    return res.status(401).send('Invalid auth header')
  }

  try {
    const payload = await verifyIdToken(req.get(GOOGLE_AUTH_HEADER))
    const { sub: accountNumber } = payload
    const accessToken = req.get(GOOGLE_AT_HEADER)

    req.user = {
      accountNumber,
      accessToken,
    }

    next()
  } catch (err) {
    return next(err)
  }
}
