export const FETCH_TREE_AVALABLE = 'FETCH_TREE_AVALABLE';
export const SEARCH_TREE_AVAILABLE = 'SEARCH_TREE_AVAILABLE';

export const actFetchTreeAvailable = trees => {
  return {
    type: FETCH_TREE_AVALABLE,
    trees
  };
};

export const actSearchTreeAvailable = keyword => {
  return {
    type: SEARCH_TREE_AVAILABLE,
    keyword
  };
};
