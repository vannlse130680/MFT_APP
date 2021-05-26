import { makeStyles } from '@material-ui/styles';

import { Page, SearchBar } from 'components';
import React, { Component, useState } from 'react';


import Header from './Header';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const TreePage = () => {
  const classes = useStyles();
  const initGardensValue = [
    {
      id: 1,
      name: 'vườn ổi',
      address: 'Quận 1',
      status: 'P'
    },
    {
      id: 2,
      name: 'vuon man',
      address: 'Quận 2',
      status: 'P'
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
    console.log(keyword);
    var arr = initGardensValue;
    console.log(arr);
    var result = filterByValue(arr, keyword);

    if (keyword && keyword.trim() !== '') {
      console.log('ok');
      setGardens(result);
    } else {
      setGardens(initGardensValue);
    }
    // console.log(gardens)
  };

  return (
    <Page
      className={classes.root}
      title="Tree Management"
    >
      <Header />
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      
    </Page>
  );
};

export default TreePage;
