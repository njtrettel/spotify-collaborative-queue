import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import NowPlaying from './NowPlaying';
import Playback from './Playback';

const stateToProps = (state, ownProps) => {
  const nowPlaying = state.nowPlaying;
  return {
    nowPlaying
  };
};

const Footer = (props) => {
  const classes = classnames(props.className, 'footer');
  return (
    <div className={classes}>
      <NowPlaying className="footer__left" nowPlaying={props.nowPlaying} roomId={props.roomId} />
      <Playback className="footer__center" nowPlaying={props.nowPlaying} player={props.player} />
      <div className="footer__right" />
    </div>
  );
};

Footer.propTypes = {
  player: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
  nowPlaying: PropTypes.object.isRequired
};

export default connect(stateToProps)(Footer);
