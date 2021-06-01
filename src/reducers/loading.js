import { HIDE_LOADING, SHOW_LOADING } from "actions/loading";

var initState = false;
var loading = (state = initState, action) => {
  switch (action.type) {
    case SHOW_LOADING:
      state = true;

      return state;
    case HIDE_LOADING:
      state = false;

      return state;
    default:
      return state;
  }
};

export default loading;
