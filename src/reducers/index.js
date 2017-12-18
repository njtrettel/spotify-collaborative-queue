import { combineReducers } from 'redux';
import songs from './songs';
import nowPlaying from './nowPlaying';

const collaborativeQueueApp = combineReducers({
  songs, nowPlaying
})

export default collaborativeQueueApp;
