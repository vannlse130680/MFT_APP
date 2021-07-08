import {
  FETCH_TREE_PROCESSES,
  SEARCH_TREE_PROCESSES
} from 'actions/treeProcesses';
import moment from 'moment';

var initState = [];
var arrSearch = [];
var treeProcesses = (state = initState, action) => {
  switch (action.type) {
    case FETCH_TREE_PROCESSES:
      state = action.treeProcesses.reverse();
      for (let index = 0; index < action.treeProcesses.length; index++) {
        state[index].searchDate = moment(
          action.treeProcesses[index].date
        ).format('DD/MM/YYYY');
      }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_TREE_PROCESSES:
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

export default treeProcesses;
