# Notes around using the Google APIs

## General flow of a client/server integration with Google Auth

1. Render a button to log the user in
   - This can be done using [`signin2.render`](https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapisignin2renderid-options), or using a [custom solution](https://developers.google.com/identity/sign-in/web/build-button)
     > Authenticating the user will allow us to retrieve an `idToken`, which can be verified against Google to get the user ID, and an `accessToken`, which can be used to make API calls on behalf of the user.
1. Once logged in, retrieve their access token using [`GoogleUser.getAuthResponse`](https://developers.google.com/identity/sign-in/web/reference#googleusergetauthresponseincludeauthorizationdata)
   - This will also give the `idToken` of the user
1. If needed, use [`.grantOfflineAccess`](https://developers.google.com/identity/sign-in/web/reference#googleauthgrantofflineaccessoptions) to request a refresh token, which can be used by the server.
   - This is an extra prompt to the user
   - TODO: Investigate if this is possible to club in with the user login step, in the case where the user is _not_ authenticated already
1. Send the values to the server for backend processing
   - [Authenticate ID token on the Backend](https://developers.google.com/identity/sign-in/web/backend-auth)
   - [Exchanging the refresh token](https://developers.google.com/identity/sign-in/web/server-side-flow)
     > ID token is for authenticating users, and storing data against the user by looking up their user ID. Access token is for immediate use for calling APIs. If using the refresh token, it should be stored for later in a DB to exchange for fresh access tokens without having to prompt the user, or for use when the user is not in a browser session.
1. Use the access token, either from user or refresh token exchange, to make API calls

## Links

- [Google Client-Side Signin Reference](https://developers.google.com/identity/sign-in/web/reference)
- [Google Server Auth](https://developers.google.com/identity/sign-in/web/server-side-flow)
- [Sheets API Reference](https://developers.google.com/sheets/api/guides/concepts)
- [OAuth Docs](https://auth0.com/docs/flows/concepts/regular-web-app-login-flow#how-to-implement-it)

## Todos

- [ ] Complete Add Entry
- [ ] Complete Delete Entry
- [ ] Start using Developer Metadata to find spreadsheets
- [ ] Source `.serverenv` for dev mode only
- [ ] Styling
- [ ] Service worker for offline
