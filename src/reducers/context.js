import _ from 'lodash';
import {
  PLAY_SONG,
  PLAY_SONG_SUCCESS,
  PLAY_SONG_FAIL,
  QUEUE_SONG,
  QUEUE_SONG_SUCCESS,
  QUEUE_SONG_FAIL
} from '../actions/player.js';

const context = (state = { upNext: { loading: false, error: null, songs: [] }, queue: { loading: false, error: null, songs: [] } }, action) => {
  switch (action.type) {
    case PLAY_SONG:
      return {
        upNext: {
          loading: true,
          error: null,
          songs: state.upNext.songs
        },
        queue: state.queue
      };
    case PLAY_SONG_SUCCESS:
      return {
        upNext: {
          loading: false,
          error: null,
          songs: action.songs
        },
        queue: state.queue
      };
    case PLAY_SONG_FAIL:
      return {
        upNext: {
          loading: false,
          error: action.error,
          songs: state.upNext.songs
        },
        queue: state.queue
      };
    case QUEUE_SONG:
      return {
        upNext: state.upNext,
        queue: {
          loading: true,
          error: null,
          songs: state.queue.songs
        }
      };
    case QUEUE_SONG_SUCCESS:
      return {
        upNext: state.upNext,
        queue: {
          loading: false,
          error: null,
          songs: _.concat(state.queue.songs, action.song)
        }
      };
    case QUEUE_SONG_FAIL:
      return {
        upNext: state.upNext,
        queue: {
          loading: false,
          error: action.error,
          songs: state.queue.songs
        }
      };
    default:
      return state;
  }
};

export default context;
