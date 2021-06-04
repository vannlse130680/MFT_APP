
import { FETCH_TREES, SEARCH_TREES } from "actions/trees";

var initState = [];
var arrSearch = [];
var trees = (state = initState, action) => {
  switch (action.type) {
    case FETCH_TREES:
      state = action.trees;
      
      // for (let index = 0; index < action.gardens.length; index++) {
      //   // state[index].treeTypeName = action.plantTypes[index].t.typeName;
      //   state[index].statusName =
      //     action.gardens[index].status === 1 ? 'Hoạt động' : 'Tạm ngưng';
      // }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_TREES:
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

export default trees;
