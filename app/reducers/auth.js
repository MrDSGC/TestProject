const initialState = {
  token: null,
  user: {}
};

export default function auth(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }

  switch (action.type) {
    case 'UPDATE_PROFILE_SUCCESS':
      return Object.assign({}, state, {
        user: action.user,
        token: action.token
      });
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        user: action.user
      });
    case 'OAUTH_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        user: action.user
      });
    case 'LOGOUT_SUCCESS':
      return initialState;
    default:
      return state;
  }
}
