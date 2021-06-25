export const FETCH_WARDS = 'FETCH_WARDS';
export const SEARCH_WARDS = 'SEARCH_WARDS';


export const actFetchWard = (wards) => {
  return {
    type: FETCH_WARDS,
    wards
  };
};

export const actSearchWards = (keyword) => {
  return {
    type: SEARCH_WARDS,
    keyword
  };
};
