export const FETCH_GARDENS = 'FETCH_GARDENS';
export const SEARCH_GARDENS = 'SEARCH_GARDENS';


export const actFetchGardens = (gardens) => {
  return {
    type: FETCH_GARDENS,
    gardens
  };
};

export const actSearchGardens = (keyword) => {
  return {
    type: SEARCH_GARDENS,
    keyword
  };
};
