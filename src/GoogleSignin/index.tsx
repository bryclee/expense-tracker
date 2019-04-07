import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';

interface AuthState {
  loggedIn: boolean;
  idToken?: string;
}

function renderGoogleSignin(ref) {
  return new Promise((resolve, reject) => {
    gapi.signin2.render(ref, {
      scope: 'email https://www.googleapis.com/auth/spreadsheets',
      onsuccess: resolve,
      onfailure: reject
    });
  });
}

function listenForAuthChanges(cb) {
  gapi.auth2.getAuthInstance().isSignedIn.listen(cb);
}

function checkGoogleAuth(): AuthState {
  const authResponse = gapi.auth2
    .getAuthInstance()
    .currentUser.get()
    .getAuthResponse(true);
  const loggedIn = Boolean(authResponse);

  if (!loggedIn) return { loggedIn };

  const idToken = authResponse.id_token;

  return {
    loggedIn,
    idToken
  };
}

export interface GoogleSigninProps {
  updateAuth: (auth: AuthState) => void;
}

const GoogleSignin = (props: GoogleSigninProps) => {
  const [gapiLoaded, setGapiLoaded] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthState>({ loggedIn: false });
  const signinButton = useRef(null);

  useEffect(() => {
    if (!gapiLoaded) {
      return;
    }

    renderGoogleSignin(signinButton.current).then(() => {
      setAuthState(checkGoogleAuth());
      listenForAuthChanges(auth => setAuthState(checkGoogleAuth()));
    });
  }, [gapiLoaded]);

  // gapiLoaded is a promise initialized in public/index.html file
  if (!gapiLoaded && gapiScriptLoaded && gapiScriptLoaded.then) {
    gapiScriptLoaded.then(() => setGapiLoaded(true));
  } else if (!gapiLoaded) {
    // TODO: some more elaborate error handling if google auth doesn't load
    return <div style={{ color: 'red' }}>Google Auth failed to load</div>;
  }

  return (
    <div className={styles.googleSignin} ref={signinButton}>
      {authState && authState.idToken}
    </div>
  );
};

export default GoogleSignin;
