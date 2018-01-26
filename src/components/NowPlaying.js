import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classnames from 'classnames';

const renderLink = (to, display) => (
  <Link to={to}>{display}</Link>
);

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
      <div className="now-playing__album-art"><Link to={pathToContext}><img src={albumArtUrl} /></Link></div>
      <div className="now-playing__song">
        <div className="now-playing__song-info now-playing__song-info--title"><Link to={pathToContext}>{title || '-----'}</Link></div>
        <div className="now-playing__song-info now-playing__song-info--artists"><Link to={pathToContext}>{artists || '---'}</Link></div>
      </div>
    </div>
  );
};

NowPlaying.propTypes = {
  nowPlaying: PropTypes.object.isRequired
};


export default NowPlaying;
