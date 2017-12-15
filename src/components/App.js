import React from 'react';
import Header from './Header';
import SpotifyContent from './SpotifyContent';

export default class App extends React.Component {
  render() {
    return (
      <div className="main-app">
        <Header className="main-app__header"/>
        <SpotifyContent />
      </div>
    );
  }
}
