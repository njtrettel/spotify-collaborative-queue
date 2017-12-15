import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { spotifyToken } from '../secrets';
import collaborativeQueueApp from '../reducers';

window.onSpotifyPlayerAPIReady = () => {
  const player = new Spotify.Player({
    name: 'Collaborative Play Queue',
    getOAuthToken: cb => { cb(spotifyToken); }
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
      <Provider store={createStore(collaborativeQueueApp)}
        <App player={player} playerData={data} />
      </Provider>,
      document.getElementById('root')
    );
  });

  player.connect();
}
