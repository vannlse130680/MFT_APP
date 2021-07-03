import { FETCH_TREES, SEARCH_TREES } from 'actions/trees';

var initState = [];
var arrSearch = [];
var trees = (state = initState, action) => {
  switch (action.type) {
    case FETCH_TREES:
      state = action.trees.reverse();

      for (let index = 0; index < action.trees.length; index++) {
        // state[index].treeTypeName = action.plantTypes[index].t.typeName;
        state[index].standard = state[index].standard
          ? state[index].standard
          : '';
        state[index].image = state[index].image ? state[index].image : '';
        state[index].description = state[index].description
          ? state[index].description
          : '';
        state[index].statusName =
          action.trees[index].status === 1
            ? 'Hoạt động'
            : action.trees[index].status === 2
            ? 'Đã bán'
            : 'Tạm ngừng';
      }

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
  console.log(array);
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
