export const SESSION_LOGIN = 'SESSION_LOGIN';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';

export const login = account => dispatch =>
  dispatch({
    type: SESSION_LOGIN,
    account
  });

export const logout = () => dispatch =>
  dispatch({
    type: SESSION_LOGOUT
  });
