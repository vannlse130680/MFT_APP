export const FETCH_DISTRICTS = 'FETCH_DISTRICTS';
export const SEARCH_DISTRICTS = 'SEARCH_DISTRICTS';


export const actFetchDistricts = (districts) => {
  return {
    type: FETCH_DISTRICTS,
    districts
  };
};

export const actSearchDistricts = (keyword) => {
  return {
    type: SEARCH_DISTRICTS,
    keyword
  };
};
