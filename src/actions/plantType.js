export const FETCH_PLANT_TYPES = 'FETCH_PLANT_TYPE';
export const SEARCH_PLANT_TYPES = 'SEARCH_PLANT_TYPES';


export const actFetchPlantTypes = (plantTypes) => {
  return {
    type: FETCH_PLANT_TYPES,
    plantTypes
  };
};

export const actSearchPlantTypes = (keyword) => {
  return {
    type: SEARCH_PLANT_TYPES,
    keyword
  };
};
