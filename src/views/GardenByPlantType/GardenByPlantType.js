import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { actFetchGardens, actSearchGardens } from 'actions/gardens';
import { hideLoading, showLoading } from 'actions/loading';
import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import callAPI from 'utils/callAPI';
import GardenPlantTypeHeader from './Header/GardenPlantTypeHeader';
import Header from './Header/Header';
import Results from './Result/Results';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  divider: {
    marginTop: 10,
    marginBottom: 10
  }
}));

const GardenByPlantType = props => {
  const classes = useStyles();
  const plantTypeId = props.match.params.id;

  const gardensStore = useSelector(state => state.gardens);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());

    callAPI(`Garden/getGardenByPlantTypeId/${plantTypeId}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchGardens(res.data));
          dispatch(hideLoading());
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const [resetPage, setResetPage] = useState(false);

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setResetPage(!resetPage);
    dispatch(actSearchGardens(keyword));
  };

  

  return (
    <Page className={classes.root} title="Quản lý vườn">
      <AuthGuard roles={['Nông dân']} />
      <Header />
      <Divider className={classes.divider} />
      <GardenPlantTypeHeader />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {gardensStore && (
        <Results className={classes.results} gardens={gardensStore} />
      )}

    
    </Page>
  );
};

export default GardenByPlantType;
