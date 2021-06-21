export const FETCH_DELIVERY_PACKAGES = 'FETCH_DELIVERY_PACKAGES';
export const SEARCH_DELIVERY_PACKAGES = 'SEARCH_DELIVERY_PACKAGES';

export const actFetchDeliveryPackages = deliveryPackages => {
  return {
    type: FETCH_DELIVERY_PACKAGES,
    deliveryPackages
  };
};

export const actSearchDeliveryPackages = keyword => {
  return {
    type: SEARCH_DELIVERY_PACKAGES,
    keyword
  };
};
