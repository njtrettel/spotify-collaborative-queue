import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import _ from 'lodash';
import Songs from './content/Songs'
import Context from './content/Context';

const Content = (props) => {
  console.log('rendering content');
  const deviceId = _.get(props, 'deviceId');
  return (
    <div className="room-content__main">
      <Switch>
        <Route exact path="/room/:roomId" component={({ location }) => {
          const path = location.pathname + '/songs';
          return <Redirect to={path} />;
        }}/>
        <Route path="/room/:roomId/songs" component={(routerProps) => <Songs deviceId={deviceId} addToRoomQueue={props.addToRoomQueue} refreshSpotifyPlayer={props.refreshSpotifyPlayer} {...routerProps} />}/>
        <Route path="/room/:roomId/context" component={(routerProps) => <Context {...routerProps} />}/>
        <Route path="*" component={() => "Route not found"} />
      </Switch>
    </div>
  );
};

export default Content;
