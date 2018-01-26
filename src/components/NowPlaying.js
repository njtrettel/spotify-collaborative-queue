import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classnames from 'classnames';

const NowPlaying = (props) => {
  console.log('rendering NowPlaying', props);
  const nowPlayingSong = _.get(props, 'nowPlaying.song', {});
  const title = nowPlayingSong.title;
  const artists = nowPlayingSong.artists;
  const albumArtUrl = nowPlayingSong.albumArt;
  const disabled = !nowPlayingSong.title;
  const classes = classnames(props.className, 'now-playing', {
    'now-playing--disabled': disabled
  });
  const roomId = _.get(props, 'roomId', '');
  const pathToContext = `/room/${roomId}/context`;

  return (
    <div className={classes}>
      <div className="now-playing__album-art"><img src={albumArtUrl} /></div>
      <div className="now-playing__song">
        <div className="now-playing__song-info now-playing__song-info--title"><span>{title || '-----'}</span></div>
        <div className="now-playing__song-info now-playing__song-info--artists"><span>{artists || '---'}</span></div>
      </div>
    </div>
  );
};

NowPlaying.propTypes = {
  nowPlaying: PropTypes.object.isRequired
};


export default NowPlaying;
