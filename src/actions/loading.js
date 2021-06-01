export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';

export const showLoading = () => {
  return {
    type: SHOW_LOADING,
  };
};

export const hideLoading = () => {
  return {
    type: HIDE_LOADING,
  };
};
