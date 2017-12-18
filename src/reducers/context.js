import {
  PLAY_SONG,
  PLAY_SONG_SUCCESS,
  PLAY_SONG_FAIL
} from '../actions/player.js';

const context = (state = { loading: false, error: null, upNext: {}, queue: {} }, action) => {
  switch (action.type) {
    case PLAY_SONG:
      return {
        loading: true,
        error: null,
        upNext: state.upNext,
        queue: state.queue
      };
    case PLAY_SONG_SUCCESS:
      return {
        loading: false,
        error: null,
        upNext: action.songs,
        queue: state.queue
      }
    case PLAY_SONG_FAIL:
      return {
        loading: false,
        error: action.error,
        upNext: state.upNext,
        queue: state.queue
      }
    default:
      return state;
  }
};

export default context;
