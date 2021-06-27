export const FETCH_VISITINGS = 'FETCH_VISITINGS';
export const SEARCH_VISITINGS = 'SEARCH_VISITINGS';


export const actFetchVisitings = (visitings) => {
  return {
    type: FETCH_VISITINGS,
    visitings
  };
};

export const actSearchVistings = (keyword) => {
  return {
    type: SEARCH_VISITINGS,
    keyword
  };
};
