import rp from 'request-promise';
import _ from 'lodash';
import { getCookie, withAuth } from '../util';
import { updateNowPlaying } from './nowPlaying';

export const PLAY_SONG = 'PLAY_SONG';
export const PLAY_SONG_SUCCESS = 'PLAY_SONG_SUCCESS';
export const PLAY_SONG_FAIL = 'PLAY_SONG_FAIL';
export const QUEUE_SONG = 'QUEUE_SONG';
export const QUEUE_SONG_SUCCESS = 'QUEUE_SONG_SUCCESS';
export const QUEUE_SONG_FAIL = 'QUEUE_SONG_FAIL';
export const UPDATE_QUEUE = 'UPDATE_QUEUE';
export const UPDATE_QUEUE_SUCCESS = 'UPDATE_QUEUE_SUCCESS';
export const UPDATE_QUEUE_FAIL = 'UPDATE_QUEUE_FAIL';
export const NEXT_SONG = 'NEXT_SONG';
export const NEXT_SONG_SUCCESS = 'NEXT_SONG_SUCCESS';
export const NEXT_SONG_FAIL = 'NEXT_SONG_FAIL';

const playSongUrl = (deviceId) => `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
const toggleShuffleUrl = (deviceId) => `https://api.spotify.com/v1/me/player/shuffle?state=true&device_id=${deviceId}`;

const playSongAction = () => {
  return {
    type: PLAY_SONG
  };
};

const playSongSuccessAction = (song, upNext = []) => {
  return {
    type: PLAY_SONG_SUCCESS,
    song,
    upNext
  };
};

const playSongFailAction = (error) => {
  return {
    type: PLAY_SONG_FAIL,
    error
  };
};

const queueSongAction = () => {
  return {
    type: QUEUE_SONG
  };
};

const queueSongSuccessAction = (song) => {
  return {
    type: QUEUE_SONG_SUCCESS,
    song
  };
};

const queueSongFailAction = (error) => {
  return {
    type: QUEUE_SONG_FAIL,
    error
  };
};

const updateQueueAction = () => {
  return {
    type: UPDATE_QUEUE
  };
};

const updateQueueSuccessAction = (songs) => {
  return {
    type: UPDATE_QUEUE_SUCCESS,
    songs
  };
};

const updateQueueFailAction = (error) => {
  return {
    type: UPDATE_QUEUE_FAIL,
    error
  };
};

const nextSongAction = (playingFromQueue) => {
  return {
    type: NEXT_SONG,
    playingFromQueue
  };
};

const nextSongSuccessAction = (song, playingFromQueue) => {
  return {
    type: NEXT_SONG_SUCCESS,
    playingFromQueue,
    song
  };
};

const nextSongFailAction = (error) => {
  return {
    type: NEXT_SONG_FAIL,
    error
  };
};

export const playSong = (deviceId, song, refreshCallback) => (dispatch, getState) => {
  const context = getState().context;
  const loading = context.upNext.loading || context.queue.loading;
  if (loading) {
    return dispatch(playSongFailAction('cannot play song in the middle of another play song request'));
  }
  const refreshToken = getCookie('refreshToken');
  const requestPlaySong = () => {
    const accessToken = getCookie('accessToken');
    const playOptions = {
      url: playSongUrl(deviceId),
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      body: {
        'uris': [song.uri]
      },
      json: true
    };
    return rp.put(playOptions);
  };

  dispatch(playSongAction());
  return withAuth(requestPlaySong, refreshToken, refreshCallback).then(() => {
    // TODO handle song not available
    updateNowPlaying(song)(dispatch, getState);
    return dispatch(playSongSuccessAction(song));
  }).catch(error => dispatch(playSongFailAction(error)));
};

// this dispatches the same PLAY_SONG actions as the singular song version above
export const playMultipleSongs = (deviceId, songs, refreshCallback) => (dispatch, getState) => {
  const context = getState().context;
  const loading = context.upNext.loading || context.queue.loading;
  if (loading) {
    return dispatch(playSongFailAction('cannot play song in the middle of another play song request'));
  }
  const refreshToken = getCookie('refreshToken');
  const shuffledSongs = _.shuffle(songs);
  const songToPlay = _.get(shuffledSongs, '0', {});
  const uriToPlay = _.get(songToPlay, 'uri', '');
  const requestPlayMultipleSongs = () => {
    const accessToken = getCookie('accessToken');
    const playOptions = {
      url: playSongUrl(deviceId),
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      body: {
        'uris': [uriToPlay]
      },
      json: true
    };
    return rp.put(playOptions);
  };

  dispatch(playSongAction());
  return withAuth(requestPlayMultipleSongs, refreshToken, refreshCallback).then(() => {
    updateNowPlaying(songToPlay)(dispatch, getState);
    return dispatch(playSongSuccessAction(songToPlay, _.slice(shuffledSongs, 1)));
  }).catch(error => dispatch(playSongFailAction(error)));
};

export const queueSong = (song) => (dispatch, getState) => {
  dispatch(queueSongAction());
  return Promise.resolve(dispatch(queueSongSuccessAction(song)));
};

export const updateQueue = (songs) => (dispatch, getState) => {
  dispatch(updateQueueAction());
  return Promise.resolve(dispatch(updateQueueSuccessAction(songs)));
};

export const nextSong = (deleteSong, deviceId, refreshCallback) => (dispatch, getState) => {
  console.log('next song');
  const context = getState().context;
  const queue = _.get(context.queue, 'songs', []);
  const upNext = _.get(context.upNext, 'songs', []);
  const loading = context.upNext.loading || context.queue.loading;
  if (loading) {
    return dispatch(nextSongFailAction('cannot play song in the middle of another play song request'));
  }
  const playingFromQueue = !_.isEmpty(queue);
  const nextSongToPlay = playingFromQueue ? queue[0] : upNext[0];
  if (playingFromQueue && _.get(queue[0], 'source', '') === deviceId) {
    deleteSong(_.get(queue[0], 'id'));
  }

  dispatch(nextSongAction(playingFromQueue));
  if (nextSongToPlay) {
    const refreshToken = getCookie('refreshToken');
    const requestNextSong = () => {
      const accessToken = getCookie('accessToken');
      console.log('requesting play song with token', accessToken, deviceId);
      const playOptions = {
        url: playSongUrl(deviceId),
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        body: {
          'uris': [nextSongToPlay.uri]
        },
        json: true
      };
      return rp.put(playOptions).then(() => console.log('next song success'));
    };

    return withAuth(requestNextSong, refreshToken, refreshCallback)
      .then(() => {
        updateNowPlaying(nextSongToPlay)(dispatch, getState);
        return dispatch(nextSongSuccessAction(nextSongToPlay, playingFromQueue));
      }).catch((error) => console.log('next song fail') || dispatch(nextSongFailAction(error)));
  }
  console.log('no next song');
  return Promise.resolve(dispatch(nextSongSuccessAction()));
};

/* Shuffle stuff

export const TOGGLE_SHUFFLE_ON = 'TOGGLE_SHUFFLE_ON';
export const TOGGLE_SHUFFLE_ON_SUCCESS = 'TOGGLE_SHUFFLE_ON_SUCCESS';
export const TOGGLE_SHUFFLE_ON_FAIL = 'TOGGLE_SHUFFLE_ON_FAIL';
const toggleShuffleOnAction = () => {
  return {
    type: TOGGLE_SHUFFLE_ON
  };
};

const toggleShuffleOnSuccessAction = () => {
  return {
    type: TOGGLE_SHUFFLE_ON_SUCCESS
  };
};

const toggleShuffleOnFailAction = (error) => {
  return {
    type: TOGGLE_SHUFFLE_ON_FAIL
  };
};
const toggleShuffleOptions = {
  url: toggleShuffleUrl(deviceId),
  headers: {
    'Authorization': 'Bearer ' + accessToken
  },
  json: true
};
dispatch(toggleShuffleOnAction());
return rp.put(toggleShuffleOptions).then(() => {
  console.log('toggled shuffle');
  return dispatch(toggleShuffleOnSuccessAction());
}).catch(error => {
  return dispatch(toggleShuffleOnFailAction(error));
});

*/
