import React from 'react';
import { connect } from 'react-redux';
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
  const nowPlaying = _.get(props, 'nowPlaying', {});
  const title = nowPlaying.title;
  const artists = nowPlaying.artists;
  const disabled = !nowPlaying.title ? true : false;
  const classes = classnames('now-playing', {
    'now-playing--disabled': disabled
  });

  return (
    <div className={classes}>
      <div className="now-playing__previous">&#8630;</div>
      <div className="now-playing__song-info">
        <div className="now-playing__song-info--title">{title || '-----'}</div>
        <div className="now-playing__song-info--artists">{artists || '---'}</div>
      </div>
      <div className="now-playing__next">&#8631;</div>
    </div>
  );
};

export default connect(stateToProps)(NowPlaying);
