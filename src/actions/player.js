import request from 'request';
import _ from 'lodash';
import { getCookie } from '../util';

export const PLAY_SONG = 'PLAY_SONG';
export const PLAY_SONG_SUCCESS = 'PLAY_SONG_SUCCESS';
export const PLAY_SONG_FAIL = 'PLAY_SONG_FAIL';

const playSongUrl = (deviceId) => `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;

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

export const playSong = (deviceId, song) => (dispatch, getState) => {
  const accessToken = getCookie('accessToken');
  const authOptions = {
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
  request.put(authOptions, function(error, response, body) {
    if (!error) {
      return dispatch(playSongSuccessAction(song));
    } else {
      return dispatch(playSongFailAction(error));
    }
  });
};
