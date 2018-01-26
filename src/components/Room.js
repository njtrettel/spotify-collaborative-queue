import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import Horizon from '@horizon/client';
import { Grid } from 'semantic-ui-react';
import Sidebar from './Sidebar';
import Content from './Content';
import { nextSong, updateQueue } from '../actions/player';
import config from '../../config';

const actions = {
  nextSong,
  updateQueue
};

const host = config.getHorizonHost();
const horizon = new Horizon({host, secure: true});

class Room extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructing room', props.roomId);
    const roomId = props.roomId;
    const roomTable = horizon(roomId);
    horizon.connect();
    horizon.onReady().subscribe(() => {
      console.log('horizon ready');
    });
    roomTable.watch().subscribe((items) => {
      this.updateQueue(items);
    });
    this.listenForPlayerChanges();

    this.listenForPlayerChanges = this.listenForPlayerChanges.bind(this);
    this.addToRoomQueue = this.addToRoomQueue.bind(this);
    this.refreshSpotifyPlayer = this.refreshSpotifyPlayer.bind(this);
    this.state = {
      roomTable
    };
  }

  listenForPlayerChanges() {
    const player = this.props.player;
    const deviceId = this.props.deviceId;
    if (!player) {
      return false;
    }
    player.on('player_state_changed', (state => {
      console.log('player state changed', state);
      const currentTrack = _.get(state, 'track_window.current_track.uri', '');
      const previousTrack = _.get(state, 'track_window.previous_tracks.0.uri', 'defaultNotEqual');
      const duration = _.get(state, 'duration', 1);
      if ((currentTrack === previousTrack) && (duration === 0)) {
        return this.props.nextSong((id) => this.state.roomTable.remove(id), deviceId, this.refreshSpotifyPlayer);
      }
    }).bind(this));
  }

  refreshSpotifyPlayer(accessToken) {
    return this.props.refreshPlayer(accessToken).then(() => this.listenForPlayerChanges());
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
    const classes = classnames(_.get(this.props, 'className', ''), 'room-content');
    const childPropNames = ['player', 'deviceId', 'roomId'];
    const childProps = _.merge({}, _.pick(this.props, childPropNames), { addToRoomQueue: this.addToRoomQueue, refreshSpotifyPlayer: this.refreshSpotifyPlayer });
    return (
      <Grid columns={16} className={classes}>
        <Grid.Row className="room-content--wrapper">
          <Grid.Column width={3} className="room-content__column room-content__column--sidebar">
            <div className="room-content__column--wrapper">
              <Sidebar {...childProps} />
            </div>
          </Grid.Column>
          <Grid.Column width={13} className="room-content__column room-content__column--main">
            <Content {...childProps} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
};

Room.propTypes = {
  roomId: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
  refreshPlayer: PropTypes.func.isRequired
};

export default withRouter(connect(null, actions)(Room));
