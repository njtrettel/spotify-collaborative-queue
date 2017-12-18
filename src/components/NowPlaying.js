import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classnames from 'classnames';
import { Segment } from 'semantic-ui-react';

const stateToProps = (state, ownProps) => {
  const nowPlaying = state.nowPlaying;
  return {
    nowPlaying
  };
};

const NowPlaying = (props) => {
  const player = _.get(props, 'player');
  const nowPlaying = _.get(props, 'nowPlaying', {});
  const title = nowPlaying.title;
  const artists = nowPlaying.artists;
  const disabled = !nowPlaying.title ? true : false;
  const classes = classnames('now-playing', {
    'now-playing--disabled': disabled
  });

  return (
    <div className={classes}>
      <div className="now-playing__previous" onClick={() => !disabled && player.previousTrack()}>&#8630;</div>
      <Link to="/context" className="now-playing__song-info">
        <div className="now-playing__song-info--title">{title || '-----'}</div>
        <div className="now-playing__song-info--artists">{artists || '---'}</div>
      </Link>
      <div className="now-playing__next" onClick={() => !disabled && player.nextTrack()}>&#8631;</div>
    </div>
  );
};

NowPlaying.propTypes = {
  player: PropTypes.object.isRequired
};

export default connect(stateToProps)(NowPlaying);
