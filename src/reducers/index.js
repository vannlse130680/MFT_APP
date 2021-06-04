import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import loading from './loading';
import plantTypes from './planTypes'
import gardens from './gardens'
const rootReducer = combineReducers({
  session: sessionReducer,
  loading,
  plantTypes,
  gardens
});

export default rootReducer;
