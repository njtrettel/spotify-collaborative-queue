import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSongs } from '../actions/songs';
import _ from 'lodash';

const actions = {
  getSongs
};

const stateToProps = (state, ownProps) => {
  const songs = state.songs;
  return {
    songs
  };
};

class Content extends React.Component {
  componentWillMount() {
    this.props.getSongs();
  }

  render() {
    console.log(this.props);
    return (
      <div className="spotify-content__main">
        Welcome to the collab Q
        <Route exact path="/" component={() => <Redirect to="/songs" />}/>
        <Route path="/songs" component={() => <div>Hello World 2</div>}/>
      </div>
    );
  }
};

export default connect(stateToProps, actions)(Content);
