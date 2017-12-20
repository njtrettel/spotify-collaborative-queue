import _ from 'lodash';
import {
  PLAY_SONG,
  PLAY_SONG_SUCCESS,
  PLAY_SONG_FAIL,
  QUEUE_SONG,
  QUEUE_SONG_SUCCESS,
  QUEUE_SONG_FAIL,
  UPDATE_QUEUE,
  UPDATE_QUEUE_SUCCESS,
  UPDATE_QUEUE_FAIL,
  NEXT_SONG,
  NEXT_SONG_SUCCESS,
  NEXT_SONG_FAIL
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
          songs: action.songs || state.upNext.songs
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
    case UPDATE_QUEUE:
      return {
        upNext: state.upNext,
        queue: {
          loading: true,
          error: null,
          songs: state.queue.songs
        }
      };
    case UPDATE_QUEUE_SUCCESS:
      const roomQueue = action.songs;
      const localQueue = state.queue.songs;
      const localQueueTimestamps = _.map(localQueue, 'timestamp');
      const newSongsInQueue = _.reject(action.songs, (song) => _.includes(localQueueTimestamps, song.timestamp));
      const newQueue = _.sortBy(_.concat(localQueue, newSongsInQueue), 'timestamp');
      return {
        upNext: state.upNext,
        queue: {
          loading: false,
          error: null,
          songs: newQueue
        }
      };
    case UPDATE_QUEUE_FAIL:
      return {
        upNext: state.upNext,
        queue: {
          loading: false,
          error: action.error,
          songs: state.queue.songs
        }
      };
    case NEXT_SONG:
      return {
        upNext: !action.playingFromQueue ? {
          loading: true,
          error: null,
          songs: state.upNext.songs
        } : state.upNext,
        queue: action.playingFromQueue ? {
          loading: true,
          error: null,
          songs: state.queue.songs
        } : state.queue
      };
    case NEXT_SONG_SUCCESS:
      return {
        upNext: {
          loading: false,
          error: null,
          songs: !action.playingFromQueue ? _.slice(state.upNext.songs, 1) || [] : state.upNext.songs
        },
        queue: {
          loading: false,
          error: null,
          songs: action.playingFromQueue ? _.slice(state.queue.songs, 1) || [] : state.queue.songs
        }
      };
    case NEXT_SONG_FAIL:
      return {
        upNext: !action.playingFromQueue ? {
          loading: false,
          error: action.error,
          songs: state.upNext.Songs
        } : state.upNext.songs,
        queue: action.playingFromQueue ? {
          loading: false,
          error: action.error,
          songs: state.queue.songs
        } : state.queue.songs
      };
    default:
      return state;
  }
};

export default context;
