import React, { useState } from 'react';
import { AuthState } from './GoogleSignin';
import Nav, { Page } from './Nav';
import Entries from './Entries';
import { setApiContext } from './api';
import AddForm from './AddForm';

interface AppState {
  auth: AuthState;
  page: Page;
}

const App = () => {
  const [appState, updateAppState] = useState<AppState>({
    auth: { loggedIn: false },
    page: Page.Add,
  });
  const { auth, page } = appState;

  const updateAuth = (auth: AuthState) => {
    updateAppState({ auth, page: appState.page });
    setApiContext(
      auth.loggedIn
        ? { accessToken: auth.accessToken, idToken: auth.idToken }
        : null,
    );
  };

  const updatePage = (page: Page) => {
    updateAppState({ auth: appState.auth, page });
  };

  return (
    <div className="App">
      <Nav
        page={appState.page}
        updateAuth={updateAuth}
        updatePage={updatePage}
      ></Nav>
      {auth.loggedIn && page === Page.Entries ? <Entries /> : null}
      {auth.loggedIn && page === Page.Add ? <AddForm /> : null}
    </div>
  );
};

export default App;
