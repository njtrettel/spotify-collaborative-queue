import request from 'request';
import _ from 'lodash';
import { getCookie } from '../util';

export const UPDATE_NOW_PLAYING = 'UPDATE_NOW_PLAYING';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';

const updateNowPlayingAction = (song) => ({
  type: UPDATE_NOW_PLAYING,
  song
});

const playAction = () => ({
  type: PLAY
});

const pauseAction = () => ({
  type: PAUSE
});

export const updateNowPlaying = (song) => (dispatch, getState) => {
  return dispatch(updateNowPlayingAction(song));
};

export const play = () => (dispatch) => {
  return dispatch(playAction());
};

export const pause = () => (dispatch) => {
  return dispatch(pauseAction());
};
