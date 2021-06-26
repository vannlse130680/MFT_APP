export const FETCH_SCHEDULES_DETAILS = 'FETCH_SCHEDULES_DETAILS';
export const SEARCH_SCHEDULES_DETAILS = 'SEARCH_SCHEDULES_DETAILS';

export const actFetchScheduleDetails = schedules => {
  return {
    type: FETCH_SCHEDULES_DETAILS,
    schedules
  };
};

export const actSearchScheduleDetails = keyword => {
  return {
    type: SEARCH_SCHEDULES_DETAILS,
    keyword
  };
};
