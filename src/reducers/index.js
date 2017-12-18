import { combineReducers } from 'redux';
import songs from './songs';
import nowPlaying from './nowPlaying';
import context from './context';

const collaborativeQueueApp = combineReducers({
  songs, nowPlaying, context
})

export default collaborativeQueueApp;
