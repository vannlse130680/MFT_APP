export const FETCH_CITIES = 'FETCH_CITIES';
export const SEARCH_CITIES = 'SEARCH_CITIES';


export const actFetchCities = (cities) => {
  return {
    type: FETCH_CITIES,
    cities
  };
};

export const actSearchCities = (keyword) => {
  return {
    type: SEARCH_CITIES,
    keyword
  };
};
