import rp from 'request-promise';
import _ from 'lodash';
import { getCookie, withAuth, reduceSpotifyTrack } from '../util';

export const GET_SONGS = 'GET_SONGS';
export const GET_SONGS_SUCCESS = 'GET_SONGS_SUCCESS';
export const GET_SONGS_FAIL = 'GET_SONGS_FAIL';

const myLibrarySongsUrl = (offset) => `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`;
const authOptions = (accessToken, offset) => ({
  url: myLibrarySongsUrl(offset),
  headers: {
    'Authorization': 'Bearer ' + accessToken
  },
  json: true
});

const parseSongs = (songs) => (
  _.reduce(songs, (result, track) => {
    const song = _.get(track, 'track', {});
    const reducedSong = reduceSpotifyTrack(song);
    return _.concat(result, reducedSong);
  }, [])
);

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
  const refreshToken = getCookie('refreshToken');
  const requestGetSongs = () => {
    const accessToken = getCookie('accessToken');
    return rp.get(authOptions(accessToken, 0));
  };

  dispatch(getSongsAction());
  return withAuth(requestGetSongs, refreshToken).then((body) => {
    const total = _.get(body, 'total');
    let songs = _.get(body, 'items', []);
    if (total > 50) {
      const totalRequests = (total % 50) ? (total / 50 + 1) : (total / 50);
      let offsets = [];
      for (let i = 50; i < total; i+= 50) {
        offsets = _.concat(offsets, i);
      }
      const accessToken = getCookie('accessToken');
      return Promise.all(_.map(offsets, (offset) => rp.get(authOptions(accessToken, offset)) )).then(requestBodies => {
        const allSubRequestSongs = _.flatMap(requestBodies, (body) => _.get(body, 'items', []));
        const allParsedSongs = parseSongs(_.concat(songs, allSubRequestSongs));
        return dispatch(getSongsSuccessAction(allParsedSongs));
      }).catch(error => {
        dispatch(getSongsFailAction(error));
        return Promise.reject(error);
      });
    } else {
      const parsedSongs = parseSongs(songs);
      return dispatch(getSongsSuccessAction(parsedSongs));
    }
  }).catch((error) => {
    return dispatch(getSongsFailAction(error));
  });
};
