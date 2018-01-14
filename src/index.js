 import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import collaborativeQueueApp from './reducers';
import App from './components/App';
import { refreshAccessToken, getCookie } from './util';
import 'semantic-ui-css/semantic.min.css';
import SpotifyPlayer from './SpotifyPlayer';

const initialize = () => {
  const accessToken = getCookie('accessToken');
  const Player = new SpotifyPlayer(accessToken);
  const player = Player.getPlayer();

  const store = createStore(
    collaborativeQueueApp,
    applyMiddleware(thunk)
  );

  Player.initPlayer((deviceId) => {
    console.log('initilazed player, opening app');

    render(
      <Provider store={store}>
        <App SpotifyPlayer={Player} deviceId={deviceId} />
      </Provider>,
      document.getElementById('root')
    );
  });
};

window.onSpotifyPlayerAPIReady = initialize;
