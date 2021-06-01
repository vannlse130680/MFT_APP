import { FETCH_PLANT_TYPES, SEARCH_PLANT_TYPES } from 'actions/plantType';

var initState = [];
var arrSearch = []
var plantTypes = (state = initState, action) => {
  switch (action.type) {
    case FETCH_PLANT_TYPES:
      state = action.plantTypes;
      arrSearch = state
      return [...state];
    case SEARCH_PLANT_TYPES:
      // console.log(action.keyword);
      var {keyword} = action
      var result = filterByValue(arrSearch, keyword);

      if (keyword && keyword.trim() !== '') {
        return result
      }  else {
        return arrSearch
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

export default plantTypes;
