import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { resume, pause } from '../actions/nowPlaying';
import NowPlaying from './NowPlaying';
import Playback from './Playback';

const actions = {
  resume, pause
};

const stateToProps = (state, ownProps) => {
  const nowPlaying = state.nowPlaying;
  return {
    nowPlaying
  };
};

const Footer = (props) => {
  const classes = classnames(props.className, 'footer');
  const playerProps = _.pick(props, ['player', 'resume', 'pause']);
  return (
    <div className={classes}>
      <NowPlaying className="footer__left" nowPlaying={props.nowPlaying} roomId={props.roomId} />
      <Playback className="footer__center" nowPlaying={props.nowPlaying} {...playerProps} />
      <div className="footer__right" />
    </div>
  );
};

Footer.propTypes = {
  player: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
  nowPlaying: PropTypes.object.isRequired
};

export default connect(stateToProps, actions)(Footer);
