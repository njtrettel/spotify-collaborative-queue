import {
  UPDATE_NOW_PLAYING
} from '../actions/nowPlaying';
import { reduceSpotifyTrack } from '../util';

const initialState = { playing: false, paused: false, song: null };

const nowPlaying = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_NOW_PLAYING:
      return {
        playing: state.playing,
        paused: state.paused,
        song: action.song
      };
    default:
      return state;
  }
};

export default nowPlaying;
