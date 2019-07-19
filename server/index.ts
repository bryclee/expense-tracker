import { app } from './app';

// if (process.env.NODE_ENV === 'development') {
require('dotenv').config({ path: `.serverenv` });
// }

const PORT = process.env.PORT || 8000;
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
