import axios from 'axios';

// const API_URL = 'https://localhost:44316/api';
const API_URL = 'http://leminhnhan.cosplane.asia/api';

export default function callAPI(endpoint, method = 'GET', body) {
  return axios({
    method: method,
    url: `${API_URL}/${endpoint}`,
    data: body
  }).catch(err => {
    console.log(err);
  });
}
