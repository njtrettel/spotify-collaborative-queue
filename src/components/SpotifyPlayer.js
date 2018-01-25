import React from 'react';
import _ from 'lodash';
import { getCookie, refreshAccessToken } from '../util.js';

export default class SpotifyPlayer extends React.Component {
  constructor(props) {
    super(props);
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      throw new Error('no access token');
    }

    console.log('creating SpotifyPlayer', accessToken);
    this.initPlayer = this.initPlayer.bind(this);
    this.refreshPlayer = this.refreshPlayer.bind(this);

    const player = new Spotify.Player({
      name: 'Collaborative Play Queue',
      getOAuthToken: cb => cb(accessToken)
    });
    this.state = {
      player,
      deviceId: null
    };
  }

  componentWillMount() {
    console.log('SpotifyPlayer will mount');
    this.initPlayer(this.state.player).then((deviceId) => {
      console.log('player initialazed');
      this.setState({ deviceId });
    }).catch((error) => console.log('error initializing player', error));
  }

  initPlayer(player) {
    console.log('initialiazing player');
    if (!player) {
      console.log('no player');
      return Promise.reject('no player');
    }

    player.on('initialization_error', e => {
      console.error('init error', e);
    });
    player.on('authentication_error', e => {
      console.error('auth error', e);
      player.disconnect();
      const refreshToken = getCookie('refreshToken');
      refreshAccessToken(refreshToken).then((accessToken => {
        this.refreshPlayer(accessToken);
      }).bind(this));
    });
    player.on('account_error', e => {
      console.error('account error', e);
    });
    player.on('playback_error', e => {
      console.error('playback error', e);
    });

    player.connect();

    return new Promise((resolve, reject) => {
      player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);
        resolve(data.device_id);
      });
    });
  }

  refreshPlayer(accessToken) {
    console.log('refreshing player');
    if (this.state.player) {
      console.log('disconnecting old player');
      this.state.player.disconnect();
    }
    const player = new Spotify.Player({
      name: 'Collaborative Play Queue',
      getOAuthToken: cb => cb(accessToken)
    });
    return this.initPlayer(player).then((deviceId => {
      console.log('player ready', deviceId);
      this.setState({ player, deviceId });
      return deviceId;
    }).bind(this));
  }

  render() {
    console.log('rendering SpotifyPlayer', this.props);
    if (!this.state.deviceId) {
      return <div>Waiting for player</div>;
    }

    const player = this.state.player;
    const deviceId = this.state.deviceId;
    const refreshPlayer = this.refreshPlayer;
    return _.map(this.props.children, (child, i) => (
      React.cloneElement(child, { player, deviceId, refreshPlayer, key: i })
    ));
  }
}
