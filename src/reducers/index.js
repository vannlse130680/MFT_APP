import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import loading from './loading';
import plantTypes from './planTypes'
const rootReducer = combineReducers({
  session: sessionReducer,
  loading,
  plantTypes
});

export default rootReducer;
