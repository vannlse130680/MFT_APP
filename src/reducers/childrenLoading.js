import { HIDE_LOADING_CHILD, SHOW_LOADING_CHILD } from "actions/childrenLoading";


var initState = false;
var loading = (state = initState, action) => {
  switch (action.type) {
    case SHOW_LOADING_CHILD:
      state = true;

      return state;
    case HIDE_LOADING_CHILD:
      state = false;

      return state;
    default:
      return state;
  }
};

export default loading;
