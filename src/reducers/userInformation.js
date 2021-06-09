import {
  FETCH_USER_INFOR,
  UPDATE_USER_AVATAR,
  UPDATE_USER_INFOR
} from 'actions/userInformation';


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
        avatar: action.avatar
      };
    }
    case UPDATE_USER_INFOR: {
      var { infor } = action;
      return {
        ...state,

        fullname: infor.fullname,
        gender: infor.gender,
        dateOfBirth: infor.dateOfBirth,
        address: infor.address,
        phone: infor.phone,
        email: infor.email,
        
        
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default userInformation;
