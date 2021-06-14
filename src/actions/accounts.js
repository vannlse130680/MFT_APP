export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS';
export const SEARCH_ACCOUNT = 'SEARCH_ACCOUNT';


export const actFetchAccounts = (accounts) => {
  return {
    type: FETCH_ACCOUNTS,
    accounts
  };
};

export const actSearchAccounts = (keyword) => {
  return {
    type: SEARCH_ACCOUNT,
    keyword
  };
};
