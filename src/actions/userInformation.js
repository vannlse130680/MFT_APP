export const FETCH_USER_INFOR = 'FETCH_USER_INFOR';
export const UPDATE_USER_AVATAR = 'UPDATE_USER_AVATAR';



export const actFetchUserInfor = (userInfor) => {
  return {
    type: FETCH_USER_INFOR,
    userInfor
  };
};
export const actUpdateUserAvatar = (avatar) => {
  return {
    type: UPDATE_USER_AVATAR,
    avatar
  };
};

