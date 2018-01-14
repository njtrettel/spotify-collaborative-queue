import { getCookie, refreshAccessToken } from './util.js';

export default class SpotifyPlayer {
  constructor(accessToken) {
    console.log('creating SpotifyPlayer', accessToken);
    this.player = new Spotify.Player({
      name: 'Collaborative Play Queue',
      getOAuthToken: cb => cb(accessToken)
    });
    this.connect = this.connect.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  initPlayer(rerender = null) {
    console.log('initiliazing player');
    const player = this.player;
    if (!player) {
      console.log('no player');
      return Promise.reject('no player');
    }
    // Error handling
    player.on('initialization_error', e => {
      console.error('init error', e);
    });
    player.on('authentication_error', e => {
      console.error('auth error', e);
      this.player.disconnect();
      const refreshToken = getCookie('refreshToken');
      refreshAccessToken(refreshToken).then((accessToken => {
        this.refreshToken(accessToken, rerender);
        //window.location = referrer;
      }).bind(this));
    });
    player.on('account_error', e => {
      console.error('account error', e);
    });
    player.on('playback_error', e => {
      ////////////// don't need to refresh here?
      console.error('playback error', e);
    });

    player.connect();

    return new Promise((resolve, reject) => {
      this.player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);
        if (rerender) {
          rerender(data.device_id);
        }
        resolve(data.device_id);
      });
    });
  }

  connect() {
    this.player && this.player.connect();
  }

  refreshToken(accessToken, rerender) {
    console.log('refreshing player');
    this.player && this.player.disconnect();
    this.player = new Spotify.Player({
      name: 'Collaborative Play Queue',
      getOAuthToken: cb => cb(accessToken)
    });
    return this.initPlayer(rerender).then((deviceId) => console.log('player ready', deviceId));
  }

  getPlayer() {
    return this.player;
  }
}
