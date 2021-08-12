export const FETCH_TREE_SOLD = 'FETCH_TREE_SOLD';
export const SEARCH_TREE_SOLD = 'SEARCH_TREE_SOLD';

export const actFetchSold = trees => {
  return {
    type: FETCH_TREE_SOLD,
    trees
  };
};

export const actSearchSold = keyword => {
  return {
    type: SEARCH_TREE_SOLD,
    keyword
  };
};
