import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import _ from 'lodash';
import Songs from './content/Songs'
import Context from './content/Context';

const Content = (props) => {
  const deviceId = _.get(props, 'deviceId');
  return (
    <div className="spotify-content__main">
      <Route exact path="/" component={() => <Redirect to="/songs" />}/>
      <Route path="/songs" component={() => <Songs deviceId={deviceId} />}/>
      <Route path="/context" component={() => <Context />}/>
    </div>
  );
};

export default withRouter(Content);
