import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import collaborativeQueueApp from './reducers';
import 'semantic-ui-css/semantic.min.css';

const getCookie = (cookieName) => {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
  }
  return "";
};

window.onSpotifyPlayerAPIReady = () => {
  const accessToken = getCookie('accessToken');
  const player = new Spotify.Player({
    name: 'Collaborative Play Queue',
    getOAuthToken: cb => { cb(accessToken); }
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
      <Provider store={createStore(collaborativeQueueApp)}>
        <App player={player} playerData={data} />
      </Provider>,
      document.getElementById('root')
    );
  });

  player.connect();
}
