export const FETCH_GARDENS_INFOR = 'FETCH_GARDENS_INFOR';



export const actFetchGardensAllInfor = (gardenInfor) => {
  return {
    type: FETCH_GARDENS_INFOR,
    gardenInfor
  };
};

