import _ from 'lodash';
import { clientId, clientSecret } from '../secrets';
import rp from 'request-promise';

export const getCookie = (cookieName) => {
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

export const refreshAccessToken = (refreshToken) => {
  const location = window.location;
  const url = location.protocol + '//' + location.host + '/refresh';
  const authOptions = {
    url,
    form: {
      refreshToken
    },
    json: true
  };

  return rp.post(authOptions);
};

export const withAuth = (execute, refreshToken) => {
  return execute().catch(error =>
    refreshAccessToken(refreshToken).then(() =>
      execute().catch(error => Promise.reject(error))
    ).catch((error) => console.error('error refreshing token', error))
  );
};

export const reduceSpotifyTrack = (song) => {
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
  return {
    album: albumName,
    artists: parsedArtists,
    title: songTitle,
    duration,
    uri
  };
};
