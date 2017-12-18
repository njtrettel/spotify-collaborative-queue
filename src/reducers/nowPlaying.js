import {
  UPDATE_NOW_PLAYING
} from '../actions/nowPlaying.js';
import { reduceSpotifyTrack } from '../util';

const nowPlaying = (state = { song: {} }, action) => {
  switch (action.type) {
    case UPDATE_NOW_PLAYING:
      return reduceSpotifyTrack(action.song);
    default:
      return state;
  }
};

export default nowPlaying;
