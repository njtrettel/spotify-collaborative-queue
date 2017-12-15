import {
  GET_SONGS,
  GET_SONGS_SUCCESS,
  GET_SONGS_FAIL
} from '../actions/music.js';

const songs = (state = { loading: false, error: false, data: null }, action) => {
  switch (action.type) {
    case GET_SONGS:
      return {
        loading: true,
        error: false,
        data: state.data
      };
    case GET_SONGS_SUCCESS:
      return {
        loading: false,
        error: false,
        data: [
          ...state.data,
          ...action.songs
        ]
      };
    case GET_SONGS_FAIL:
      return {
        loading: false,
        error: action.error,
        data: state.data
      };
    default:
      return state;
  }
};

export default songs;
