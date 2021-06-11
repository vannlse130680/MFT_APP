export const FETCH_CONTRACTS = 'FETCH_CONTRACTS';
export const SEARCH_CONTRACTS = 'SEARCH_CONTRACTS';

export const actFetchContracts = contracts => {
  return {
    type: FETCH_CONTRACTS,
    contracts
  };
};

export const actSearchContracts = keyword => {
  return {
    type: SEARCH_CONTRACTS,
    keyword
  };
};
