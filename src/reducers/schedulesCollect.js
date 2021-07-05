import { FETCH_SCHEDULES_COLLECT, SEARCH_SCHEDULES_COLLECT } from "actions/schedulesCollect";

var initState = [];
var arrSearch = [];
var schedulesCollect = (state = initState, action) => {
  switch (action.type) {
    case FETCH_SCHEDULES_COLLECT:
      state = action.schedules.reverse();
      for (let index = 0; index < action.schedules.length; index++) {
     
        state[index].statusName =
          action.schedules[index].status === 2 ? 'Đang giao' : 'Đã giao ';
      }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_SCHEDULES_COLLECT:
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

export default schedulesCollect;
