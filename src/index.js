import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import collaborativeQueueApp from './reducers';
import App from './components/App';
import { refreshAccessToken, getCookie } from './util';
import 'semantic-ui-css/semantic.min.css';

window.onSpotifyPlayerAPIReady = () => {
  const store = createStore(
    collaborativeQueueApp,
    applyMiddleware(thunk)
  );

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
};
