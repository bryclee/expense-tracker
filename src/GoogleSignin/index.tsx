import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';

export interface AuthState {
  loggedIn: boolean;
  idToken?: string;
  accessToken?: string;
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

function getGoogleAuthState(): AuthState {
  const authResponse = gapi.auth2
    .getAuthInstance()
    .currentUser.get()
    .getAuthResponse(true);
  const loggedIn = Boolean(authResponse);

  if (!loggedIn) return { loggedIn };

  const idToken = authResponse.id_token;
  const accessToken = authResponse.access_token;

  return {
    loggedIn,
    idToken,
    accessToken
  };
}

export interface GoogleSigninProps {
  updateAuth: (auth: AuthState) => void;
}

const GoogleSignin = ({ updateAuth = () => {} }: GoogleSigninProps) => {
  const [gapiLoaded, setGapiLoaded] = useState<boolean>(false);
  const signinButton = useRef(null);

  const handleAuthChange = (auth: AuthState) => {
    updateAuth(auth);
  };

  useEffect(() => {
    if (!gapiLoaded) {
      return;
    }

    renderGoogleSignin(signinButton.current).then(() => {
      handleAuthChange(getGoogleAuthState());

      listenForAuthChanges(() => {
        handleAuthChange(getGoogleAuthState());
      });
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
    <div className={styles.googleSigninContainer}>
      <div className={styles.googleSignin} ref={signinButton} />
    </div>
  );
};

export default GoogleSignin;
