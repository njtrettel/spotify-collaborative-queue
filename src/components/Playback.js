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
      progress: 0,
      secondsPassed: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const currentlyPlaying = this.props.nowPlaying;
    const nextPropsPlaying = nextProps.nowPlaying;
    if (currentlyPlaying.song.uri !== nextPropsPlaying.song.uri) {
      this.state.currentTimer && clearTimeout(this.state.currentTimer);
      this.setState({ progress: 0 });
    }
  }

  componentDidUpdate() {
    if (this.props.nowPlaying.playing) {
      this.state.currentTimer = setTimeout(() => {
        const newProgress = this.state.progress + 200;
        const secondsPassed = (newProgress / 1000).toFixed(0);
        this.setState({ progress: this.state.progress + 200, secondsPassed })
      }, 200);
    }
  }

  render() {
    const player = _.get(this.props, 'player');
    if (!player) {
      return errorState('No player');
    }
    const classes = classnames(this.props.className, 'playback');
    const isPlaying = this.props.nowPlaying.playing;
    const duration = this.props.nowPlaying.song.duration || 0;
    const percentPlayed = duration ? (this.state.progress * 100 / duration) : 0;

    const durationMinutes = (duration / 60000).toFixed(0);
    const durationSeconds = ((duration % 60000) / 1000).toFixed(0);
    const prettyDuration = `${durationMinutes}:${('0' + durationSeconds).slice(-2)}`;

    const minutesPassed = (this.state.secondsPassed / 60).toFixed(0);
    const secondsPassed = this.state.secondsPassed % 60;
    const prettySecondsPassed = `${minutesPassed}:${('0' + secondsPassed).slice(-2)}`;
    return (
      <div className={classes}>
        <div className="playback__controls">
          <div className="playback__control playback__control--previous" onClick={() => player.previousTrack()}>&#8630;</div>
          <div className="playback__control playback__control--plause" onClick={() => isPlaying ? player.pause() : player.resume()}>
            {isPlaying ? 'PAUSE' : 'RESUME'}
          </div>
          <div className="playback__control playback__control--next" onClick={() => player.nextTrack()}>&#8631;</div>
        </div>
        <div className="playback__progress">
          <div className="playback__progress--seconds">{prettySecondsPassed}</div>
          <Progress size="tiny" className="playback__progress--bar" percent={percentPlayed} />
          <div className="playback__progress--duration">{prettyDuration}</div>
        </div>
      </div>
    );
  }
}

Playback.propTypes = {
  player: PropTypes.object.isRequired,
  nowPlaying: PropTypes.object.isRequired
};

export default Playback;
