import fs from 'fs'
import path from 'path'

type GoogleEnvVars = {
  CLIENT_ID: string
  CLIENT_SECRET: string
  REDIRECT_URI: string
}

export const getCredentials = (): GoogleEnvVars => {
  let { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'One of CLIENT_ID, CLIENT_SECRET, or REDIRECT_URI is not defined in the environment variables',
      )
    }

    ;({ CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '.serverenv'), 'utf8'),
    ))
  }

  return {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
  }
}
