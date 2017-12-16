import React from 'react';
import { Route } from 'react-router';

const Content = (props) => {
  return (
    <div className="spotify-content__main">
      Welcome to the collab Q
      <Route exact path="/" component={() => <div>Hello World home</div>}/>
      <Route path="/songs" component={() => <div>Hello World 2</div>}/>
    </div>
  );
};

export default Content;
