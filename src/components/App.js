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
//import io from 'socket.io-client';
import Horizon from '@horizon/client';
const horizon = new Horizon({host: 'localhost:8181'});
const roomTable = horizon('rooms');

const history = createBrowserHistory();

const actions = {
  updateNowPlaying,
  nextSong
};

//const socket = io();
const App = (props) => {
  const player = props.player;
  const deviceId = props.deviceId;
  horizon.connect();
  horizon.onReady().subscribe(() => {
    console.log('horizon ready');
  });
  roomTable.watch().subscribe((items) => {
    console.log('room updated', items);
  });
  /*socket.emit('createRoom', 'testRoom2', deviceId, (value) => {
    console.log('socket ack', value);
    socket.emit('queueSong', 'testRoom2', 'testSong', (value) => {
      console.log('socket ack -- queue', value);
    })
  });
  socket.on('pushQueueSong', (value) => {
    console.log('got song', value);
  });*/
  player.on('player_state_changed', state => {
    const currentTrack = _.get(state, 'track_window.current_track.uri', '');
    const previousTrack = _.get(state, 'track_window.previous_tracks.0.uri', 'defaultNotEqual');
    const duration = _.get(state, 'duration', 1);
    if ((currentTrack === previousTrack) && (duration === 0)) {
      return props.nextSong(deviceId);
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
