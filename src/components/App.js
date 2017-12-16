import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SpotifyContent from './SpotifyContent';

export default class App extends React.Component {
  render() {
    return (
      <div className="main-app">
        <Header className="main-app__bar main-app__bar--header"/>
        <SpotifyContent className="main-app__content"/>
        <Footer className="main-app__bar main-app__bar--footer" />
      </div>
    );
  }
}
