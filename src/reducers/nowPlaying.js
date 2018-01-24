import {
  UPDATE_NOW_PLAYING
} from '../actions/nowPlaying';
import { reduceSpotifyTrack } from '../util';

const nowPlaying = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_NOW_PLAYING:
      return action.song;
    default:
      return state;
  }
};

export default nowPlaying;
