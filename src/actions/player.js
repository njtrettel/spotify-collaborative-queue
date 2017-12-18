import rp from 'request-promise';
import _ from 'lodash';
import { getCookie } from '../util';

export const PLAY_SONG = 'PLAY_SONG';
export const PLAY_SONG_SUCCESS = 'PLAY_SONG_SUCCESS';
export const PLAY_SONG_FAIL = 'PLAY_SONG_FAIL';
export const QUEUE_SONG = 'QUEUE_SONG';
export const QUEUE_SONG_SUCCESS = 'QUEUE_SONG_SUCCESS';
export const QUEUE_SONG_FAIL = 'QUEUE_SONG_FAIL';

const playSongUrl = (deviceId) => `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
const toggleShuffleUrl = (deviceId) => `https://api.spotify.com/v1/me/player/shuffle?state=true&device_id=${deviceId}`;

const playSongAction = () => {
  return {
    type: PLAY_SONG
  };
};

const playSongSuccessAction = (songs) => {
  return {
    type: PLAY_SONG_SUCCESS,
    songs
  };
};

const playSongFailAction = (error) => {
  return {
    type: PLAY_SONG_FAIL
  };
};

const queueSongAction = () => {
  return {
    type: QUEUE_SONG
  };
};

const queueSongSuccessAction = (song) => {
  return {
    type: QUEUE_SONG_SUCCESS,
    song
  };
};

const queueSongFailAction = (error) => {
  return {
    type: QUEUE_SONG_FAIL,
    error
  };
};



export const playSong = (deviceId, song) => (dispatch, getState) => {
  const accessToken = getCookie('accessToken');
  const playOptions = {
    url: playSongUrl(deviceId),
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    body: {
      'uris': [song.uri]
    },
    json: true
  };

  dispatch(playSongAction());
  return rp.put(playOptions).then(() => {
    return dispatch(playSongSuccessAction([song]));
  }).catch(error => {
    return dispatch(playSongFailAction(error));
  });
};

// this dispatches the same PLAY_SONG actions as the singular song version above
export const playMultipleSongs = (deviceId, songs) => (dispatch, getState) => {
  const accessToken = getCookie('accessToken');
  const shuffledSongs = _.shuffle(songs);
  const shuffledUris = _.map(shuffledSongs, 'uri');
  const playOptions = {
    url: playSongUrl(deviceId),
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    body: {
      'uris': shuffledUris
    },
    json: true
  };

  dispatch(playSongAction());
  return rp.put(playOptions).then(() => {
    return dispatch(playSongSuccessAction(shuffledSongs));
  }).catch(error => {
    return dispatch(playSongFailAction(error));
  });
};

export const queueSong = (song) => (dispatch, getState) => {
  dispatch(queueSongAction());
  dispatch(queueSongSuccessAction(song));
};

/* Shuffle stuff

export const TOGGLE_SHUFFLE_ON = 'TOGGLE_SHUFFLE_ON';
export const TOGGLE_SHUFFLE_ON_SUCCESS = 'TOGGLE_SHUFFLE_ON_SUCCESS';
export const TOGGLE_SHUFFLE_ON_FAIL = 'TOGGLE_SHUFFLE_ON_FAIL';
const toggleShuffleOnAction = () => {
  return {
    type: TOGGLE_SHUFFLE_ON
  };
};

const toggleShuffleOnSuccessAction = () => {
  return {
    type: TOGGLE_SHUFFLE_ON_SUCCESS
  };
};

const toggleShuffleOnFailAction = (error) => {
  return {
    type: TOGGLE_SHUFFLE_ON_FAIL
  };
};
const toggleShuffleOptions = {
  url: toggleShuffleUrl(deviceId),
  headers: {
    'Authorization': 'Bearer ' + accessToken
  },
  json: true
};
dispatch(toggleShuffleOnAction());
return rp.put(toggleShuffleOptions).then(() => {
  console.log('toggled shuffle');
  return dispatch(toggleShuffleOnSuccessAction());
}).catch(error => {
  return dispatch(toggleShuffleOnFailAction(error));
});

*/
