import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import collaborativeQueueApp from './reducers';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css';

const getCookie = (cookieName) => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
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

    const store = createStore(
      collaborativeQueueApp,
      applyMiddleware(thunk)
    );

    render(
      <Provider store={store}>
        <App player={player} playerData={data} />
      </Provider>,
      document.getElementById('root')
    );
  });

  player.connect();
}
