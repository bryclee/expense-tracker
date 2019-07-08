// For react-scripts dev mode proxy - see https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development#configuring-the-proxy-manually
// This file gets automatically required by react-scripts during dev mode only
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up dev proxy on /api');
  app.use(
    proxy('/api', {
      target: `http://localhost:${process.env.SERVER_PORT || 8000}`,
    }),
  );
};
