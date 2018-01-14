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

  return rp.post(authOptions).then(() => {
    console.log('refreshed access token');
    return getCookie('accessToken');
  });
};

export const withAuth = (execute, refreshToken, refreshCallback) => {
  return execute().catch(error =>
    console.log('error with spotify auth, refreshing access token') || refreshAccessToken(refreshToken).then((accessToken) => {
      if (_.isFunction(refreshCallback)) {
        return refreshCallback(accessToken).then(() => {
          console.log('refreshed player');
          return execute().catch(error => console.log('still error with spotify auth') || Promise.reject(error));
        }).catch(error => {
          console.log('something wrong with player refresh callback', error);
          return Promise.reject(error);
        });
      }
      console.log('refresh player callback was not a function');
      return Promise.reject('refresh callback was not function')
    }).catch((error) => console.error('refreshing access token didn\'t work', error) || Promise.reject(error))
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
