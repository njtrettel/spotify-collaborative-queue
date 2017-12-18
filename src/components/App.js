import React from 'react';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory'
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from './Header';
import Footer from './Footer';
import SpotifyContent from './SpotifyContent';
import { updateNowPlaying } from '../actions/nowPlaying';

const history = createBrowserHistory();

const actions = {
  updateNowPlaying
};

const App = (props) => {
  const player = props.player;
  player.on('player_state_changed', state => props.updateNowPlaying(_.get(state, 'track_window.current_track', {})));
  return (
    <Router history={history}>
      <div className="main-app">
        <Header className="main-app__bar main-app__bar--header"/>
        <SpotifyContent className="main-app__content" {...props} />
        <Footer className="main-app__bar main-app__bar--footer" />
      </div>
    </Router>
  );
};

export default connect(null, actions)(App);
