import express, { RequestHandler, Request, Response } from 'express'
import { google } from 'googleapis'
import { getCredentials } from '../env'

const accessTokenCheck: RequestHandler = function(req, res, next) {
  if (!req.user.accessToken) {
    res.status(401).send('Missing access token in header')
  }

  next()
}
console.log()

const getGoogleAuth = function(accessToken) {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = getCredentials()
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
  )

  oauth2Client.setCredentials({ access_token: accessToken })

  return oauth2Client
}

const getGoogleSheetsApi = function(req: Request) {
  const auth = getGoogleAuth(req.user.accessToken)

  return google.sheets({ version: 'v4', auth })
}

const getSpreadsheetsHandler: RequestHandler = async function(
  req: Request,
  res: Response,
) {
  const api = getGoogleSheetsApi(req)
  const { data } = await api.spreadsheets.get({
    spreadsheetId: '1wK84gYENgkfeH08nhhJdXq-We2TdUePvzLL8bs7dma0',
  })
  // TODO: Return this value
  const { sheets } = data



  const sampleResponse = [
    {
      id: 'aaaaabksdoqer',
      name: 'spreadsheet name 1',
    },
  ]

  res.send(<SpreadsheetsResponse>sampleResponse)
}

const getEntriesHandler: RequestHandler = function(req, res) {
  const sampleResponse = [
    {
      id: '123531',
      name: 'hotdog',
      category: 'food',
      amount: '12.23',
      date: '12/23/2018',
    },
  ]
  res.send(<EntriesResponse>sampleResponse)
}

export function spreadsheetsApi() {
  const router = express.Router()

  router.use(accessTokenCheck)
  router.get('/spreadsheets', getSpreadsheetsHandler)
  router.get('/spreadsheets/:spreadsheetId/entries', getEntriesHandler)

  return router
}
