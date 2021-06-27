import { FETCH_VISITINGS, SEARCH_VISITINGS } from 'actions/visitings';

var initState = [];
var arrSearch = [];
var wards = (state = initState, action) => {
  switch (action.type) {
    case FETCH_VISITINGS:
      state = action.visitings;
      for (let index = 0; index < action.visitings.length; index++) {
        
        state[index].statusName =
          action.visitings[index].status === 1 ? 'Đã xác nhận' : 'Đang chờ';
      }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_VISITINGS:
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

export default wards;
