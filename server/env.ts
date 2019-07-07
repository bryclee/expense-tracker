type GoogleEnvVars = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
};

export const getCredentials = (): GoogleEnvVars => {
  let { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error(
      'One of CLIENT_ID, CLIENT_SECRET, or REDIRECT_URI is not defined in the environment variables',
    );
  }

  return {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
  };
};
