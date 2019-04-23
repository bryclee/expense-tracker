import express from 'express';
import * as path from 'path';
import { headerAuthMiddleware } from './auth';
import { entriesApis } from './apis';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// import { googleRedirectMiddleware } from './auth';

app.use(express.static(path.join(process.cwd(), isProd ? 'build' : 'public')));
app.use('/api', headerAuthMiddleware, entriesApis());
app.use((error, req, res, next) => {
  console.error('Request failed with error:', error);
  res.status(500).send('Error');
});

export { app };
