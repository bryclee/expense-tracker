const { google } = require('googleapis');
const { GOOGLE_SCOPES } = require('../../shared/constants');

const { clientId, clientSecret, redirectUrl } = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl: process.env.GOOGLE_AUTH_REDIRECT_URL
};
const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUrl
);

const authUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'online',

  // If you only need one scope you can pass it as a string
  scope: GOOGLE_SCOPES
});

module.exports = (req, res, next) => {
  // do some google auth
  if (!req.query.code) {
    return res.redirect(authUrl);
  }

  next();
};

module.exports.getOAuthClient = () => oauth2Client;
