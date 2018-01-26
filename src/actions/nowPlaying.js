import request from 'request';
import _ from 'lodash';
import { getCookie } from '../util';

export const UPDATE_NOW_PLAYING = 'UPDATE_NOW_PLAYING';
export const RESUME = 'RESUME';
export const PAUSE = 'PAUSE';

const updateNowPlayingAction = (song) => ({
  type: UPDATE_NOW_PLAYING,
  song
});

const resumeAction = () => ({
  type: RESUME
});

const pauseAction = () => ({
  type: PAUSE
});

export const updateNowPlaying = (song) => (dispatch, getState) => {
  return dispatch(updateNowPlayingAction(song));
};

export const resume = () => (dispatch) => {
  return dispatch(resumeAction());
};

export const pause = () => (dispatch) => {
  return dispatch(pauseAction());
};
