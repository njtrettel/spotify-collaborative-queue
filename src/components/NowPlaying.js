import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import classnames from 'classnames';
import { Segment } from 'semantic-ui-react';

const stateToProps = (state, ownProps) => {
  const nowPlaying = state.nowPlaying;
  return {
    nowPlaying
  };
};

const errorState = (error) => (
  <div className="now-playing--error">
    {error}
  </div>
);

const NowPlaying = (props) => {
  const SpotifyPlayer = _.get(props, 'SpotifyPlayer');
  const player = _.isFunction(SpotifyPlayer.getPlayer) ? SpotifyPlayer.getPlayer() : null;
  if (!player) {
    return errorState();
  }

  const nowPlaying = _.get(props, 'nowPlaying', {});
  const title = nowPlaying.title;
  const artists = nowPlaying.artists;
  const disabled = !nowPlaying.title;
  const classes = classnames('now-playing', {
    'now-playing--disabled': disabled
  });
  const roomId = _.get(props, 'roomId', '');
  const pathToContext = `/room/${roomId}/context`;

  return (
    <div className={classes}>
      <div className="now-playing__previous" onClick={() => !disabled && player.previousTrack()}>&#8630;</div>
      <Link to={pathToContext} className="now-playing__song-info">
        <h4 className="now-playing__song-info--title">{title || '-----'}</h4>
        <h6 className="now-playing__song-info--artists">{artists || '---'}</h6>
      </Link>
      <div className="now-playing__next" onClick={() => !disabled && player.nextTrack()}>&#8631;</div>
    </div>
  );
};

NowPlaying.propTypes = {
  SpotifyPlayer: PropTypes.object.isRequired
};

export default connect(stateToProps)(withRouter(NowPlaying));
