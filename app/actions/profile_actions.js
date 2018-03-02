import axios from 'axios';
import { browserHistory } from 'react-router';

export const editProfile = () => dispatch => {
  dispatch({type: 'EDIT_PROFILE', payload: {}})
}

export function goToPath(path) {
  browserHistory.push(path);
  return {
    type: ''
  };
}
