import request from 'request';
import _ from 'lodash';
import { getCookie, reduceSpotifyTrack } from '../util';

export const GET_SONGS = 'GET_SONGS';
export const GET_SONGS_SUCCESS = 'GET_SONGS_SUCCESS';
export const GET_SONGS_FAIL = 'GET_SONGS_FAIL';

const myLibrarySongsUrl = (offset) => `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`;

const getSongsAction = () => {
  return {
    type: GET_SONGS
  };
};

const getSongsSuccessAction = (songs) => {
  return {
    type: GET_SONGS_SUCCESS,
    songs
  };
};

const getSongsFailAction = (error) => {
  return {
    type: GET_SONGS_FAIL,
    error
  };
};

export const getSongs = () => (dispatch, getState) => {
  const accessToken = getCookie('accessToken');
  const authOptions = {
    url: myLibrarySongsUrl(0),
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    json: true
  };

  dispatch(getSongsAction());
  request.get(authOptions, function(error, response, body) {
    if (!error) {
      const songs = _.get(body, 'items', []);
      const parsedSongs = _.reduce(songs, (result, track) => {
        const song = _.get(track, 'track', {});
        const reducedSong = reduceSpotifyTrack(song);
        return _.concat(result, reducedSong);
      }, []);
      return dispatch(getSongsSuccessAction(parsedSongs));
    } else {
      return dispatch(getSongsFailAction(error));
    }
  });

};
