import {
  UPDATE_NOW_PLAYING,
  PLAY,
  PAUSE
} from '../actions/nowPlaying';
import { reduceSpotifyTrack } from '../util';

const initialState = { playing: false, paused: false, song: {} };

const nowPlaying = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_NOW_PLAYING:
      return {
        playing: true,
        paused: false,
        song: action.song
      };
    case PLAY:
      return {
        playing: true,
        paused: false,
        song: action.song
      };
    case PAUSE:
      return {
        playing: false,
        paused: true,
        song: action.song
      };
    default:
      return state;
  }
};

export default nowPlaying;
