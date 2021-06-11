import { FETCH_CONTRACTS, SEARCH_CONTRACTS } from "actions/contracts";


var initState = [];
var arrSearch = [];
var contracts = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CONTRACTS:
      console.log(action.contracts)
      state = action.contracts;
      
      for (let index = 0; index < action.contracts.length; index++) {
        // state[index].treeTypeName = action.plantTypes[index].t.typeName;
        state[index].statusName =
          action.contracts[index].status === 1 ? 'Hoạt động' : 'Tạm ngưng';
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
