import { makeStyles } from '@material-ui/styles';

import { Page, SearchBar } from 'components';
import React, {  useState } from 'react';
import Header from './components/Header';
import Results from './components/Result/Results';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const GardenPage = () => {
  const classes = useStyles();
  const initGardensValue = [
    {
      id: 1,
      name: 'Vườn trái cây Long Khánh',
      address: 'Đồng Nai',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Vườn trái cây Trung An',
      address: 'Củ Chi',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Khu du lịch Cồn Phụng',
      address: 'Bến Tre',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Miệt vườn Vĩnh Kim',
      address: 'Tiền Giang',
      status: 'pending'
    }
  ];
  const [gardens, setGardens] = useState(initGardensValue);

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
  const handleFilter = () => {};
  const handleSearch = keyword => {
    var arr = initGardensValue;

    var result = filterByValue(arr, keyword);

    if (keyword && keyword.trim() !== '') {
      setGardens(result);
    } else {
      setGardens(initGardensValue);
    }
    // console.log(gardens)
  };

  return (
    <Page className={classes.root} title="Garden Management">
      <Header />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {gardens && <Results className={classes.results} gardens={gardens} />}
    </Page>
  );
};

export default GardenPage;
