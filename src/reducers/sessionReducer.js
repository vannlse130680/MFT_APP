import * as actionTypes from 'actions';
import { createBrowserHistory } from 'history';

const initialState = {
  loggedIn: false,

  user: {
    first_name: 'Van',
    last_name: 'Nguyen',
    email: 'demo@devias.io',
    avatar: '',
    bio: 'Nông dân',
    role: 'ADMIN' // ['GUEST', 'USER', 'ADMIN']
  }
};

const sessionReducer = (state = initialState, action) => {
  const history = createBrowserHistory();
  switch (action.type) {
    case actionTypes.SESSION_LOGIN: {
      state.loggedIn = true
      return {
        ...state,
        loggedIn: true
      };
    }

    case actionTypes.SESSION_LOGOUT: {
      return {
        ...state,
        loggedIn: false,
        user: {
          role: 'GUEST'
        }
      };
    }

    default: {
      
      return {...state}
    }
  }
};

export default sessionReducer;
