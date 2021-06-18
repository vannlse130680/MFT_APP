export const FETCH_TREE_PROCESSES = 'FETCH_TREE_PROCESSES';
export const SEARCH_TREE_PROCESSES = 'SEARCH_TREE_PROCESSES';


export const actFetchTreeProcesses = (treeProcesses) => {
  return {
    type: FETCH_TREE_PROCESSES,
    treeProcesses
  };
};

export const actSearchTreeProcesses = (keyword) => {
  return {
    type: SEARCH_TREE_PROCESSES,
    keyword
  };
};
