import React from 'react';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory'
import { Switch, Route } from 'react-router-dom';
import JoinRoom from './JoinRoom';
import Room from './Room';

const history = createBrowserHistory();

const App = (props) => {
  console.log('rendering app');
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={JoinRoom} />
        <Route path="/room/:roomId" component={({ match }) => {
          const roomId = match.params.roomId;
          return <Room deviceId={props.deviceId} player={props.player} roomId={roomId} />;
        }} />
        <Route path="*" component={() => "Route not found"} />
      </Switch>
    </Router>
  );
};

export default App;
