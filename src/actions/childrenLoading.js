export const SHOW_LOADING_CHILD = 'SHOW_LOADING_CHILD';
export const HIDE_LOADING_CHILD = 'HIDE_LOADING_CHILD';

export const showLoadingChildren = () => {
  return {
    type: SHOW_LOADING_CHILD,
  };
};

export const hideLoadingChildren = () => {
  return {
    type: HIDE_LOADING_CHILD,
  };
};
