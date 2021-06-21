export const FETCH_CONTRACT_DETAIL = 'FETCH_CONTRACT_DETAIL';
export const SEARCH_CONTRACT_DETAIL = 'SEARCH_CONTRACT_DETAIL';


export const actFetchContractDetail = (contractDetail) => {
  return {
    type: FETCH_CONTRACT_DETAIL,
    contractDetail
  };
};

export const actSearchContractDetail = (keyword) => {
  return {
    type: SEARCH_CONTRACT_DETAIL,
    keyword
  };
};
