import React, { Component } from 'react';
import GoogleSignin from './GoogleSignin';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { auth: {} };
  }

  updateAuth(auth) {
    this.setState({ auth });
  }

  render() {
    return (
      <div className="App">
        <GoogleSignin updateAuth={this.updateAuth} />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
