import React from 'react';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory'
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from './Header';
import Footer from './Footer';
import SpotifyContent from './SpotifyContent';
import { updateNowPlaying } from '../actions/nowPlaying';
import { nextSong } from '../actions/player';

const history = createBrowserHistory();

const actions = {
  updateNowPlaying,
  nextSong
};

const App = (props) => {
  const player = props.player;
  const deviceId = props.deviceId;
  player.on('player_state_changed', state => {
    const currentTrack = _.get(state, 'track_window.current_track.uri', '');
    const previousTrack = _.get(state, 'track_window.previous_tracks.0.uri', 'defaultNotEqual');
    const duration = _.get(state, 'duration', 1);
    if ((currentTrack === previousTrack) && (duration === 0)) {
      console.log('song ended');
      return props.nextSong(deviceId).then((result) => {
        console.log(result);
      });
    }
    props.updateNowPlaying(_.get(state, 'track_window.current_track', {}));
  });
  return (
    <Router history={history}>
      <div className="main-app">
        <Header className="main-app__bar main-app__bar--header" />
        <SpotifyContent className="main-app__content" player={player} deviceId={deviceId} />
        <Footer className="main-app__bar main-app__bar--footer" />
      </div>
    </Router>
  );
};

export default connect(null, actions)(App);
