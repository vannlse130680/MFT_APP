

import { FETCH_TREE_SOLD, SEARCH_TREE_SOLD } from 'actions/treeSold';
import moment from 'moment';

var initState = [];
var arrSearch = [];
var treeSold = (state = initState, action) => {
  switch (action.type) {
    case FETCH_TREE_SOLD:
      
      state = action.trees.reverse();

      for (let index = 0; index < action.trees.length; index++) {
        // state[index].treeTypeName = action.plantTypes[index].t.typeName;
        // state[index].statusName = statusName[action.contracts[index].status];
        state[index].searchDate = moment(action.trees[index].date).format('DD/MM/YYYY');
      }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_TREE_SOLD:
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

export default treeSold;
