import React from 'react';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory'
import { Switch, Route } from 'react-router-dom';
import JoinRoom from './JoinRoom';
import Room from './Room';
import Header from './Header';
import Footer from './Footer';

const history = createBrowserHistory();

const App = (props) => {
  console.log('rendering app');
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={JoinRoom} />
        <Route path="/room/:roomId" component={({ match }) => {
          const roomId = match.params.roomId;
          return (
            <div className="main-app">
              <Header className="main-app__bar main-app__bar--header" />
              <Room className="main-app__content" deviceId={props.deviceId} SpotifyPlayer={props.SpotifyPlayer} roomId={roomId} />
              <Footer className="main-app__bar main-app__bar--footer" />
            </div>
          );
        }} />
        <Route path="*" component={() => "Route not found"} />
      </Switch>
    </Router>
  );
};

export default App;
