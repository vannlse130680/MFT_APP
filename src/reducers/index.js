import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import loading from './loading';
import plantTypes from './planTypes'
import gardens from './gardens'
import trees from './trees'
import gardenInfor from './gardenInfor'
import childrenLoading from './childrenLoading'
const rootReducer = combineReducers({
  session: sessionReducer,
  loading,
  childrenLoading,
  plantTypes,
  gardens,
  trees,
  gardenInfor
});

export default rootReducer;
