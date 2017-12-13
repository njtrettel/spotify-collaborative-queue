import React from 'react';
import {render} from 'react-dom';
import App from './App';

window.onSpotifyPlayerAPIReady = () => {
  const token = 'BQDhaM6CABMmfZ272BOZHBqrjR1ZgYZyVnPgRBVEmrWSvmBRSzy9Qo1J2gPgC-xeEBOqUnjqJVTxKWfHY47jV66n0Bl7HQkx_1TVCieMYnv3kk7O4NrLfp1FT2dN008UNetbxjvjzLCytm4QJ_PmQygRDaOM_6rx8izp';
  const player = new Spotify.Player({
    name: 'Collaborative Play Queue',
    getOAuthToken: cb => { cb(token); }
  });

  // Error handling
  player.on('initialization_error', e => console.error(e));
  player.on('authentication_error', e => console.error(e));
  player.on('account_error', e => console.error(e));
  player.on('playback_error', e => console.error(e));

  // Playback status updates
  player.on('player_state_changed', state => console.log(state));

  player.on('ready', data => {
    console.log('Ready with Device ID', data.device_id);

    render(
      <App player={player} playerData={data} />,
      document.getElementById('root')
    );
  });

  player.connect();
}
