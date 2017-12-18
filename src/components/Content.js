import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSongs } from '../actions/songs';
import _ from 'lodash';
import Songs from './content/Songs'

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
    const songs = _.get(this.props, 'songs', []);
    return (
      <div className="spotify-content__main">
        <Route exact path="/" component={() => <Redirect to="/songs" />}/>
        <Route path="/songs" component={() => <Songs songs={songs} />}/>
      </div>
    );
  }
};

export default connect(stateToProps, actions)(Content);
