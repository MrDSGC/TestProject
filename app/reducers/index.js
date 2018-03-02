import { combineReducers } from 'redux';
import auth from './auth';
import projects from './projects';
import profiles from './profiles';
import messages from './messages';

export default combineReducers({
  auth,
  projects,
  profiles,
  messages
});
