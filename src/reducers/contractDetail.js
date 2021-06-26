import {
  FETCH_CONTRACT_DETAIL,
  SEARCH_CONTRACT_DETAIL
} from 'actions/contractDetail';
const statusName = {
  0: 'Bắt đầu',
  1: 'Chờ thu hoạch',
  2: 'Đã thu hoạch',
  3: 'Đã giao'
};
var initState = [];
var arrSearch = [];
var contractDetail = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CONTRACT_DETAIL:
      state = action.contractDetail;
      for (let index = 0; index < action.contractDetail.length; index++) {
        state[index].startHarvest =
          action.contractDetail[index].startHarvest === '0001-01-01T00:00:00'
            ? ''
            : action.contractDetail[index].startHarvest;
        state[index].endHarvest =
          action.contractDetail[index].endHarvest === '0001-01-01T00:00:00'
            ? ''
            : action.contractDetail[index].endHarvest;
        state[index].deliveryDate =
          action.contractDetail[index].deliveryDate === '0001-01-01T00:00:00'
            ? ''
            : action.contractDetail[index].deliveryDate;
        state[index].statusName =
          statusName[action.contractDetail[index].status];
      }

      // state.plantTypeName = action.plantTypes.t.typeName
      arrSearch = state;
      return [...state];
    case SEARCH_CONTRACT_DETAIL:
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

export default contractDetail;
