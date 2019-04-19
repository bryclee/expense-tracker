import express from 'express';
import * as path from 'path';
import { headerAuthMiddleware } from './auth';

const app = express();
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === 'production';

// import { googleRedirectMiddleware } from './auth';

app.use(express.static(path.join(process.cwd(), isProd ? 'build' : 'public')));
app.use('/api', headerAuthMiddleware, (req, res, next) => {
  res.status(200).send('Success');
});
app.use((error, req, res, next) => {
  console.error('Request failed with error:', error);
  res.status(500).send('Error');
});

const server = app.listen(PORT, () => {
  const serverAddress = server.address();
  let address, port;

  if (typeof serverAddress === 'string') {
    port = PORT;
  } else {
    address = serverAddress.address;
    port = serverAddress.port;
  }

  console.log(`Server started and listening on ${address}:${port}`);
});
