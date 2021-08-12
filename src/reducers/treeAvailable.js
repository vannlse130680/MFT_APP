
import { FETCH_TREE_AVALABLE, SEARCH_TREE_AVAILABLE } from 'actions/treeAvailable';
import moment from 'moment';

var initState = [];
var arrSearch = [];
var treeAvailable = (state = initState, action) => {
  switch (action.type) {
    case FETCH_TREE_AVALABLE:
      
      state = action.trees.reverse();

      // for (let index = 0; index < action.contracts.length; index++) {
      //   // state[index].treeTypeName = action.plantTypes[index].t.typeName;
      //   state[index].statusName = statusName[action.contracts[index].status];
      //   state[index].searchDate = moment(action.contracts[index].date).format('DD/MM/YYYY');
      // }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_TREE_AVAILABLE:
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

export default treeAvailable;
