import {
  GET_SONGS,
  GET_SONGS_SUCCESS,
  GET_SONGS_FAIL
} from '../actions/songs.js';

const songs = (state = { loading: false, error: false, songs: [] }, action) => {
  switch (action.type) {
    case GET_SONGS:
      return {
        loading: true,
        error: false,
        songs: state.songs
      };
    case GET_SONGS_SUCCESS:
      return {
        loading: false,
        error: false,
        songs: action.songs
      };
    case GET_SONGS_FAIL:
      return {
        loading: false,
        error: action.error,
        songs: state.songs
      };
    default:
      return state;
  }
};

export default songs;
