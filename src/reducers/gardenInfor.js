import { FETCH_GARDENS_INFOR } from 'actions/gardenInfor';

var initState = { pt: {}, tt: {} };

var gardenInfor = (state = initState, action) => {
  switch (action.type) {
    case FETCH_GARDENS_INFOR:
      state = action.gardenInfor;

      state.pt = action.gardenInfor.pt;
      state.tt = action.gardenInfor.tt;

      return { ...state };

    default:
      return state;
  }
};

// function filterByValue(array, string) {
//   return array.filter(o =>
//     Object.keys(o).some(k =>
//       o[k]
//         .toString()
//         .toLowerCase()
//         .includes(string.trim().toLowerCase())
//     )
//   );
// }

export default gardenInfor;
