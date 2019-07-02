# Hello Expense Tracker

## Setup steps to run

1. Obtain a dev Google Client ID from [here](https://console.cloud.google.com/apis/credentials), with allowed redirect URI as `http://localhost:8000`
1. Create a file `.env` with the following:

```
REACT_APP_GOOGLE_CLIENT_ID=<google client id>
```

1. Create a file `.serverenv` with the following:

```
CLIENT_ID=<google client id>
CLIENT_SECRET=<google client secret>
REDIRECT_URI=<google redirect URI>
```

1. Start the app in dev mode using `npm run dev`
