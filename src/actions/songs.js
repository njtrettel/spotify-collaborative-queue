import request from 'request';
import rp from 'request-promise';
import _ from 'lodash';
import { getCookie, reduceSpotifyTrack } from '../util';

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

const parseSongs = (songs) => {
  let uris = [];
  const parsedSongs = _.reduce(songs, (result, track) => {
    const song = _.get(track, 'track', {});
    const reducedSong = reduceSpotifyTrack(song);
    uris = _.concat(uris, reducedSong.uri);
    return _.concat(result, reducedSong);
  }, []);
  return {
    uris,
    parsedSongs
  };
};

const getSongsAction = () => {
  return {
    type: GET_SONGS
  };
};

const getSongsSuccessAction = (songs, uris) => {
  return {
    type: GET_SONGS_SUCCESS,
    songs,
    uris
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

  dispatch(getSongsAction());
  request.get(authOptions(accessToken, 0), function(error, response, body) {
    if (!error) {
      const total = _.get(body, 'total');
      let songs = _.get(body, 'items', []);
      if (total > 50) {
        const totalRequests = (total % 50) ? (total / 50 + 1) : (total / 50);
        let offsets = [];
        for (let i = 50; i < total; i+= 50) {
          offsets = _.concat(offsets, i);
        }
        Promise.all(_.map(offsets, (offset) => rp.get(authOptions(accessToken, offset)) )).then(requestBodies => {
          const allSubRequestSongs = _.flatMap(requestBodies, (body) => _.get(body, 'items', []));
          const { parsedSongs: allParsedSongs, uris } = parseSongs(_.concat(songs, allSubRequestSongs));
          dispatch(getSongsSuccessAction(allParsedSongs, uris));
        }).catch(error => {
          throw error;
          dispatch(getSongsFailAction(error));
        });
      } else {
        const { parsedSongs, uris } = parseSongs(songs);
        return dispatch(getSongsSuccessAction(parsedSongs, uris));
      }
    } else {
      return dispatch(getSongsFailAction(error));
    }
  });

};
