import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import loading from './loading';
import plantTypes from './planTypes';
import gardens from './gardens';
import trees from './trees';
import gardenInfor from './gardenInfor';
import childrenLoading from './childrenLoading';
import userInfor from './userInformation';
import contracts from './contracts';
import accounts from './accounts';
import treeProcesses from './treeProcesses';
import contractDetail from './contractDetail';
import deliveryPackages from './deliveryPackages';
import cities from './cities';
import districts from './districts';
import wards from './wards';
import schedulesCollect from './schedulesCollect';
import scheduleDetails from './scheduleDetails'
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
  treeProcesses,
  contractDetail,
  deliveryPackages,
  cities,
  districts,
  wards,
  schedulesCollect,
  scheduleDetails
});

export default rootReducer;
