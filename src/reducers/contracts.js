import { FETCH_CONTRACTS, SEARCH_CONTRACTS } from 'actions/contracts';
const statusName = {
  2: 'Đã hủy',
  0: 'Mới',
  1: 'Hoạt động',
  3: 'Chờ xác nhận',
  4: 'Chờ xác nhận hủy',
  5: 'Hoàn thành'

};
var initState = [];
var arrSearch = [];
var contracts = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CONTRACTS:
      console.log(action.contracts);
      state = action.contracts.reverse();

      for (let index = 0; index < action.contracts.length; index++) {
        // state[index].treeTypeName = action.plantTypes[index].t.typeName;
        state[index].statusName = statusName[action.contracts[index].status];
      }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_CONTRACTS:
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

export default contracts;
