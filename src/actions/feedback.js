export const FETCH_FEED_BACKS = 'FETCH_FEED_BACKS';
export const SEARCH_FEED_BACKS = 'SEARCH_FEED_BACKS';


export const actFetchFeedbacks = (feedbacks) => {
  return {
    type: FETCH_FEED_BACKS,
    feedbacks
  };
};

export const actSearchFeedbacks = (keyword) => {
  return {
    type: SEARCH_FEED_BACKS,
    keyword
  };
};
