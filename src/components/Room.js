import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import Horizon from '@horizon/client';
import Header from './Header';
import Footer from './Footer';
import SpotifyContent from './SpotifyContent';
import { updateNowPlaying } from '../actions/nowPlaying';
import { nextSong, updateQueue } from '../actions/player';

const actions = {
  updateNowPlaying,
  nextSong,
  updateQueue
};

const horizon = new Horizon({host: 'localhost:8181', secure: true});

class Room extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructing room', props.roomId);
    const roomId = props.roomId;
    const roomTable = horizon(roomId);
    const player = props.player;
    const deviceId = props.deviceId;
    horizon.connect();
    horizon.onReady().subscribe(() => {
      console.log('horizon ready');
    });
    roomTable.watch().subscribe((items) => {
      this.updateQueue(items);
    });
    player.on('player_state_changed', state => {
      const currentTrack = _.get(state, 'track_window.current_track.uri', '');
      const previousTrack = _.get(state, 'track_window.previous_tracks.0.uri', 'defaultNotEqual');
      const duration = _.get(state, 'duration', 1);
      if ((currentTrack === previousTrack) && (duration === 0)) {
        return props.nextSong(deviceId);
      }
      props.updateNowPlaying(_.get(state, 'track_window.current_track', {}));
    });
    this.addToRoomQueue = this.addToRoomQueue.bind(this);
    this.state = {
      roomTable
    };
  }

  updateQueue(items) {
    console.log('queue updated', items);
    this.props.updateQueue(items);
  }

  addToRoomQueue(song) {
    this.state.roomTable.insert(song);
  }

  render() {
    console.log('rendering room');
    const childPropNames = ['player', 'deviceId', 'roomId'];
    const childProps = _.merge({}, _.pick(this.props, childPropNames), { addToRoomQueue: this.addToRoomQueue });
    return (
      <div className="main-app">
        <Header className="main-app__bar main-app__bar--header" />
        <SpotifyContent className="main-app__content" {...childProps} />
        <Footer className="main-app__bar main-app__bar--footer" />
      </div>
    );
  }
};

Room.propTypes = {
  roomId: PropTypes.string.isRequired
};

export default withRouter(connect(null, actions)(Room));
