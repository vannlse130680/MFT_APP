import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { actFetchAccounts, actSearchAccounts } from 'actions/accounts';
import {
  hideLoadingChildren,
  showLoadingChildren
} from 'actions/childrenLoading';
import { actFetchCities, actSearchCities } from 'actions/cities';
import { hideLoading, showLoading } from 'actions/loading';
import { actSearchTreeProcesses } from 'actions/treeProcesses';
import Axios from 'axios';
import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import { toastError, toastSuccess } from 'utils/toastHelper';
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

const CityPage = () => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [banUsername, setBanUsername] = useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const [value, setValue] = useState(true); //
  const citisStore = useSelector(state => state.cities);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());

    callAPI('City', 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());
          dispatch(actFetchCities(res.data));
          dispatch(actSearchCities(searchValue));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [value]);

  const [resetPage, setResetPage] = useState(false);

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setResetPage(!resetPage);
    setSearchValue(keyword);
    dispatch(actSearchCities(keyword));
  };

  const handleClickBanAccount = account => {
    handleClickOpen();
    setBanUsername(account);
  };
  const handleBanAccount = () => {
    dispatch(showLoadingChildren());
    callAPI(`Account/ChangeAccountStatus/${banUsername.username}`, 'PUT', null)
      .then(res => {
        if (res.data) {
          toastSuccess(
            banUsername.status === 1
              ? 'Kh??a th??nh c??ng !'
              : 'M??? kh??a th??nh c??ng !'
          );
          dispatch(hideLoadingChildren());
          setValue(!value);
          handleClose();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleEventImport = data => {
    dispatch(showLoading());
    console.log(data);
    Axios.post('http://leminhnhan.cosplane.asia/api/City/addCity', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());
          toastSuccess('Import th??nh c??ng !');
          setValue(!value);
        } else {
          dispatch(hideLoading());
          toastError('Import th???t b???n !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Page className={classes.root} title="Qu???n l?? ?????a ch???">
      <AuthGuard roles={['Qu???n l??']} />
      <Header onAddEvent={handleEventImport} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {citisStore && (
        <Results
          onBan={handleClickBanAccount}
          className={classes.results}
          cities={citisStore}
        />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <GoblaLoadingChildren />
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontSize: 20 }}>
            {banUsername.status === 1 ? 'Kh??a t??i kho???n' : 'M??? kh??a t??i kho???n'}
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {banUsername.status === 1
              ? 'B???n c?? ch???c ch???n mu???n kh??a t??i kho???n n??y! Vi???c kh??a t??i kho???n ?????ng ngh??a v???i vi???c ng?????i d??ng kh??ng th??? s??? d???ng ????ng nh???p ???????c v??o h??? th???ng !'
              : 'B???n c?? ch???c ch???n mu???n m??? kh??a t??i kho???n n??y! Vi???c m??? t??i kho???n ?????ng ngh??a v???i vi???c cho ph??p ng?????i d??ng ????ng nh???p v??o ???????c h??? th???ng !'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>H???y b???</Button>
          <Button onClick={handleBanAccount} color="primary" autoFocus>
            ?????ng ??
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default CityPage;
