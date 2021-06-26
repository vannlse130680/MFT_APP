export const FETCH_SCHEDULES_COLLECT = 'FETCH_SCHEDULES_COLLECT';
export const SEARCH_SCHEDULES_COLLECT = 'SEARCH_SCHEDULES_COLLECT';

export const actFetchSchedulesCollect = schedules => {
  return {
    type: FETCH_SCHEDULES_COLLECT,
    schedules
  };
};

export const actSearchSchedulesCollect = keyword => {
  return {
    type: SEARCH_SCHEDULES_COLLECT,
    keyword
  };
};
