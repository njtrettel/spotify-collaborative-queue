import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { Progress } from 'semantic-ui-react';

const errorState = (error) => (
  <div className="playback--error">
    {error}
  </div>
);

class Playback extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const currentlyPlaying = this.props.nowPlaying;
    const nextPropsPlaying = nextProps.nowPlaying;
    console.log('PLAYBACK will receive props', currentlyPlaying, nextPropsPlaying);
    if (currentlyPlaying.song.uri !== nextPropsPlaying.song.uri) {
      this.state.currentTimer && clearTimeout(this.state.currentTimer);
      this.setState({ progress: 0 });
    }
  }

  componentDidUpdate() {
    if (this.props.nowPlaying.playing) {
      this.state.currentTimer = setTimeout(() => this.setState({ progress: this.state.progress + 200 }), 200);
    }
  }

  render() {
    const player = _.get(this.props, 'player');
    if (!player) {
      return errorState('No player');
    }
    const classes = classnames(this.props.className, 'playback');
    const isPlaying = this.props.nowPlaying.playing;
    const duration = this.props.nowPlaying.song.duration;
    const percentPlayed = duration ? (this.state.progress * 100 / duration) : 0;
    return (
      <div className={classes}>
        <div className="playback__controls">
          <div className="playback__control playback__control--previous" onClick={() => player.previousTrack()}>&#8630;</div>
          <div className="playback__control playback__control--plause" onClick={() => isPlaying ? player.pause() : player.resume()}>
            {isPlaying ? 'PAUSE' : 'RESUME'}
          </div>
          <div className="playback__control playback__control--next" onClick={() => player.nextTrack()}>&#8631;</div>
        </div>
        <Progress className="playback__progress" size="tiny" percent={percentPlayed} />
      </div>
    );
  }
}

Playback.propTypes = {
  player: PropTypes.object.isRequired,
  nowPlaying: PropTypes.object.isRequired
};

export default Playback;
