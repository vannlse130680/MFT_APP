import { FETCH_ACCOUNTS, SEARCH_ACCOUNT, } from 'actions/accounts';

var initState = [];
var arrSearch = [];
var accounts = (state = initState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      state = action.accounts;
      console.log(action.accounts)
      for (let index = 0; index < action.accounts.length; index++) {
        state[index].avatar = state[index].avatar ? state[index].avatar : '';
        state[index].city = state[index].city ? state[index].city : '';
        state[index].district = state[index].district ? state[index].district : '';
        state[index].statusName =
          action.accounts[index].status === 1 ? 'Hoạt động' : 'Đã khóa';
      }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_ACCOUNT:
      // console.log(action.keyword);
      var { keyword } = action;
      var result = filterByValue(arrSearch, keyword);

      if (keyword && keyword.trim() !== '') {
        return result;
      } else {
        return arrSearch;
      }

    default:
      return state;
  }
};

function filterByValue(array, string) {
  return array.filter(o =>
    Object.keys(o).some(k =>
      o[k]
        .toString()
        .toLowerCase()
        .includes(string.trim().toLowerCase())
    )
  );
}

export default accounts;
