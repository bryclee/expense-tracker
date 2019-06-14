import express, { RequestHandler } from 'express'

const accessTokenCheck: RequestHandler = function(req, res, next) {
  if (!req.user.accessToken) {
    res.status(401).send('Missing access token in header')
  }

  next()
}

const getSpreadsheetsHandler: RequestHandler = function(req, res) {
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
