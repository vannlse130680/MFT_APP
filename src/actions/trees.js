export const FETCH_TREES = 'FETCH_TREES';
export const SEARCH_TREES = 'SEARCH_TREES';


export const actFetchTREES = (trees) => {
  return {
    type: FETCH_TREES,
    trees
  };
};

export const actSearchTREES = (keyword) => {
  return {
    type: SEARCH_TREES,
    keyword
  };
};
