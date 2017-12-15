export const GET_SONGS = 'GET_SONGS';
export const GET_SONGS_SUCCESS = 'GET_SONGS_SUCCESS';
export const GET_SONGS_FAIL = 'GET_SONGS_FAIL';

const getSongsAction = () => {
  return {
    type: GET_SONGS
  };
};

const getSongsSuccessAction = () => {
  return {
    type: GET_SONGS_SUCCESS
  };
};

const getSongsFailAction = () => {
  return {
    type: GET_SONGS_FAIL
  };
};

export const getSongs = () => (dispatch, getState) => {
  dispatch(getSongsAction());
  return dispatch(getSongsSuccessAction());
};
