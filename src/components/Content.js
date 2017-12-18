import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSongs } from '../actions/songs';
import { playSong, playMultipleSongs, queueSong } from '../actions/player';
import _ from 'lodash';
import Songs from './content/Songs'
import Context from './content/Context';

const actions = {
  getSongs,
  playSong,
  playMultipleSongs,
  queueSong
};

const playActions = ['playSong', 'playMultipleSongs'];
const queueActions = ['queueSong'];
const songsProps = ['songs', 'deviceId'];
const contextProps = ['context', 'nowPlaying'];

const stateToProps = (state, ownProps) => {
  const songs = state.songs;
  const context = state.context;
  const nowPlaying = state.nowPlaying;
  return {
    songs, context, nowPlaying
  };
};

class Content extends React.Component {
  componentWillMount() {
    this.props.getSongs();
  }

  render() {
    const songs = _.get(this.props, 'songs', []);
    const deviceId = _.get(this.props, 'deviceId');
    return (
      <div className="spotify-content__main">
        <Route exact path="/" component={() => <Redirect to="/songs" />}/>
        <Route path="/songs" component={() => <Songs {..._.pick(this.props, [...songsProps, ...playActions, ...queueActions])} />}/>
        <Route path="/context" component={() => <Context {..._.pick(this.props, contextProps)} />}/>
      </div>
    );
  }
};

export default withRouter(connect(stateToProps, actions)(Content));
