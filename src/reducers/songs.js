import {
  GET_SONGS,
  GET_SONGS_SUCCESS,
  GET_SONGS_FAIL
} from '../actions/songs.js';

const songs = (state = { loading: false, error: false, data: {} }, action) => {
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
        data: {
          songs: action.songs,
          uris: action.uris
        }
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
