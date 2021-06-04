import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import loading from './loading';
import plantTypes from './planTypes'
import gardens from './gardens'
import trees from './trees'
import gardenInfor from './gardenInfor'
const rootReducer = combineReducers({
  session: sessionReducer,
  loading,
  plantTypes,
  gardens,
  trees,
  gardenInfor
});

export default rootReducer;
