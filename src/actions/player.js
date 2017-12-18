import rp from 'request-promise';
import _ from 'lodash';
import { getCookie } from '../util';

export const PLAY_SONG = 'PLAY_SONG';
export const PLAY_SONG_SUCCESS = 'PLAY_SONG_SUCCESS';
export const PLAY_SONG_FAIL = 'PLAY_SONG_FAIL';
export const TOGGLE_SHUFFLE_ON = 'TOGGLE_SHUFFLE_ON';
export const TOGGLE_SHUFFLE_ON_SUCCESS = 'TOGGLE_SHUFFLE_ON_SUCCESS';
export const TOGGLE_SHUFFLE_ON_FAIL = 'TOGGLE_SHUFFLE_ON_FAIL';

const playSongUrl = (deviceId) => `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
const toggleShuffleUrl = (deviceId) => `https://api.spotify.com/v1/me/player/shuffle?state=true&device_id=${deviceId}`;

const playSongAction = () => {
  return {
    type: PLAY_SONG
  };
};

const playSongSuccessAction = (song) => {
  return {
    type: PLAY_SONG_SUCCESS,
    song
  };
};

const playSongFailAction = (error) => {
  return {
    type: PLAY_SONG_FAIL
  };
};

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
    return dispatch(playSongSuccessAction());
  }).catch(error => {
    return dispatch(playSongFailAction(error));
  });
};

// this dispatches the same PLAY_SONG actions as the singular song version above
// but also toggles shuffle
export const playMultipleSongs = (deviceId, uris) => (dispatch, getState) => {
  const accessToken = getCookie('accessToken');
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
    dispatch(toggleShuffleOnSuccessAction());
    const playOptions = {
      url: playSongUrl(deviceId),
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      body: {
        'uris': uris
      },
      json: true
    };

    dispatch(playSongAction());
    return rp.put(playOptions).then(() => {
      return dispatch(playSongSuccessAction());
    }).catch(error => {
      return dispatch(playSongFailAction(error));
    });
  }).catch(error => {
    dispatch(toggleShuffleOnFailAction(error));
  });
};
