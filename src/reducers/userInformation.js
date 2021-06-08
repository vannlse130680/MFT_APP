import { FETCH_USER_INFOR, UPDATE_USER_AVATAR } from 'actions/userInformation';

const initialState = {};

const userInformation = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_INFOR: {
      state = action.userInfor;
      return state;
    }

    case UPDATE_USER_AVATAR: {
      return {
        ...state,
        avatar : action.avatar
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default userInformation;
