import request from 'request';
import _ from 'lodash';
import { getCookie } from '../util';

export const UPDATE_NOW_PLAYING = 'UPDATE_NOW_PLAYING';

const updateNowPlayingAction = (song) => {
  return {
    type: UPDATE_NOW_PLAYING,
    song
  };
};

export const updateNowPlaying = (song) => (dispatch, getState) => {
  return dispatch(updateNowPlayingAction(song));
};
