import request from 'request';
import _ from 'lodash';

export const GET_SONGS = 'GET_SONGS';
export const GET_SONGS_SUCCESS = 'GET_SONGS_SUCCESS';
export const GET_SONGS_FAIL = 'GET_SONGS_FAIL';

const myLibrarySongsUrl = (offset) => `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`;

const getCookie = (cookieName) => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

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
        const albumName = _.get(song, 'album.name', '');
        const artists = _.get(song, 'artists', []);
        const parsedArtists = _.reduce(artists, (artistString, artist, i) => {
          const artistName = _.get(artist, 'name');
          if (!artistName) {
            return artistString;
          }
          return artistString + artistName + (i !== (artists.length - 1) ? ', ' : '');
        }, '');
        const songTitle = _.get(song, 'name', '');
        const duration = _.get(song, 'duration_ms', '');
        const uri = _.get(song, 'uri', '');
        return _.concat(result, {
          album: albumName,
          artists: parsedArtists,
          title: songTitle,
          duration,
          uri
        });
      }, []);
      return dispatch(getSongsSuccessAction(parsedSongs));
    } else {
      return dispatch(getSongsFailAction(error));
    }
  });

};
