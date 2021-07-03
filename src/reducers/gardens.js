import { FETCH_GARDENS, SEARCH_GARDENS } from "actions/gardens";

var initState = [];
var arrSearch = [];
var gardens = (state = initState, action) => {
  switch (action.type) {
    case FETCH_GARDENS:
      state = action.gardens.reverse();
      
      for (let index = 0; index < action.gardens.length; index++) {
        // state[index].treeTypeName = action.plantTypes[index].t.typeName;
        state[index].statusName =
          action.gardens[index].status === 1 ? 'Hoạt động' : 'Tạm ngưng';
      }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_GARDENS:
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

export default gardens;
