import React from 'react';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory'
import Header from './Header';
import Footer from './Footer';
import SpotifyContent from './SpotifyContent';

const history = createBrowserHistory();

export default class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <div className="main-app">
          <Header className="main-app__bar main-app__bar--header"/>
          <SpotifyContent className="main-app__content"/>
          <Footer className="main-app__bar main-app__bar--footer" />
        </div>
      </Router>
    );
  }
}
