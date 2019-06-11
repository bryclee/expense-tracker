import React, { useState } from 'react';
import GoogleSignin, { AuthState } from './GoogleSignin';
import Pre from './common/Pre';
import Entries from './Entries';

interface AppState {
  auth: AuthState;
}

const App = () => {
  const [state, updateState] = useState<AppState>({
    auth: { loggedIn: false }
  });
  const { auth } = state;

  const updateAuth = (auth: AuthState) => updateState({ auth });

  return (
    <div className="App">
      <GoogleSignin updateAuth={updateAuth} />
      {auth.loggedIn ? <Entries /> : <div>not logged in</div>}
      <Pre>Auth state: {JSON.stringify(auth, null, 2)}</Pre>
    </div>
  );
};

export default App;
