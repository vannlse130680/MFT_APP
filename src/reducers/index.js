import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import loading from './loading';
import plantTypes from './planTypes'
import gardens from './gardens'
import trees from './trees'
import gardenInfor from './gardenInfor'
import childrenLoading from './childrenLoading'
import userInfor from './userInformation'
import contracts from'./contracts'
import accounts from './accounts'
import treeProcesses from './treeProcesses'
const rootReducer = combineReducers({
  session: sessionReducer,
  loading,
  childrenLoading,
  plantTypes,
  gardens,
  trees,
  gardenInfor,
  userInfor,
  contracts,
  accounts,
  treeProcesses
});

export default rootReducer;
