import { FETCH_DISTRICTS, SEARCH_DISTRICTS } from "actions/districts";



var initState = [];
var arrSearch = [];
var districts = (state = initState, action) => {
  switch (action.type) {
    case FETCH_DISTRICTS:
      state = action.districts;
      // for (let index = 0; index < action.plantTypes.length; index++) {
      //   state[index].treeTypeName = action.plantTypes[index].t.typeName;
      //   state[index].statusName =
      //     action.plantTypes[index].status === 1 ? 'Hoạt động' : 'Tạm ngưng';
      // }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_DISTRICTS:
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

export default districts;
