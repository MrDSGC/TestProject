import moment from 'moment';
import cookie from 'react-cookie';
import axios from 'axios';
import { browserHistory } from 'react-router';

// gets current user if logged in. if not logged in, does nothing.
export function getCurrentUser(token) {
  return (dispatch) => {
    return fetch('/api/currentUser', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'SIGNUP_SUCCESS',
            token: json.token,
            user: json.user
          });
          if (json.token) {
            cookie.save('token', json.token, { path: '/', expires: moment().add(5, 'year').toDate()});
          }
          browserHistory.push(json.nextStepURL);
        });
      }
    })
  }
}

export function login(email, password) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            token: json.token,
            user: json.user
          });
          cookie.save('token', json.token, {path: '/', expires: moment().add(5, 'year').toDate() });
          browserHistory.push('/projects');
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'LOGIN_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function signup(email, password, inviteCode) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });

    return fetch('/signup', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email: email, password: password, inviteCode })
    }).then((response) => {
      return response.json().then((json) => {
        if (response.ok) {
          dispatch({
            type: 'SIGNUP_SUCCESS',
            token: json.token,
            user: json.user
          });
          browserHistory.push('/completeProfile');
          cookie.save('token', json.token, { expires: moment().add(5, 'year').toDate(), path: '/' });
        } else {
          dispatch({
            type: 'SIGNUP_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        }
      });
    });
  };
}

export function logout() {
  console.log("here")
  cookie.remove('token', { path: '/'});
  cookie.remove('token');
  browserHistory.push('/');
  return {
    type: 'LOGOUT_SUCCESS'
  };
}

export function forgotPassword(email) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/forgot', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'FORGOT_PASSWORD_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'FORGOT_PASSWORD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function resetPassword(password, confirm, pathToken) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch(`/reset/${pathToken}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          browserHistory.push('/login');
          dispatch({
            type: 'RESET_PASSWORD_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'RESET_PASSWORD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function updateProfile(state, token, sendWelcomeEmail, callBack) {
  var dataObject = state.user;
  dataObject.sendWelcomeEmail = sendWelcomeEmail;

  return (dispatch) => {
    return fetch('/account', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataObject)
    }).then((response) => {
      if (response.ok) {
        return response.json().then( (json) => {
          dispatch({
            type: 'UPDATE_PROFILE_SUCCESS',
            token: json.token,
            user: json.user
          });
          callBack();
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_PROFILE_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function changePassword(password, confirm, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/account', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        password: password,
        confirm: confirm
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'CHANGE_PASSWORD_SUCCESS',
            messages: [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'CHANGE_PASSWORD_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function deleteAccount(token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/account', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(logout());
          dispatch({
            type: 'DELETE_ACCOUNT_SUCCESS',
            messages: [json]
          });
        });
      }
    });
  };
}

/****** Added a claim code ********/
// update user auth token
export function updateUserStateWithClaimCode(userObject, callBack) {
  return (dispatch) => {
    return ( () => {
      dispatch({
        type: 'UPDATE_PROFILE_SUCCESS',
        user: userObject
      });
      callBack();
    }) ();
  }
};

/****** Admin Login as function ********/
export function adminLoginAs(response) {
  return (dispatch) => {
    if (response.statusText == "OK") {
      return ( () => {
        dispatch({
          type: 'LOGIN_SUCCESS',
          token: response.data.token,
          user: response.data.user
        });
        cookie.remove('token', { path: '/'});
        cookie.remove('token');
        cookie.save('token', response.data.token, {path: '/', expires: moment().add(5, 'year').toDate() });
        browserHistory.push('/projects');
      }) ()
    } else {
      return ( () => {
        dispatch({
          type: 'LOGIN_FAILURE',
          messages: Array.isArray(response.data) ? response.data : [response.data]
        });
      }) ()
    }
  }
};
