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
import { actFetchDistricts, actSearchDistricts } from 'actions/districts';
import { hideLoading, showLoading } from 'actions/loading';
import { actSearchTreeProcesses } from 'actions/treeProcesses';
import { actFetchWard, actSearchWards } from 'actions/wards';
import Axios from 'axios';
import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import { toastError, toastSuccess } from 'utils/toastHelper';
import Header from './components/Header';
import BackHeader from './components/Header/BackHeader';
import Results from './components/Result/Results';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const WardPage = props => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [banUsername, setBanUsername] = useState('');
  const { districtId } = props.match.params;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const [value, setValue] = useState(true); //
  const wardsStore = useSelector(state => state.wards);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());

    callAPI(`Ward/${districtId}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());
          dispatch(actFetchWard(res.data));
          dispatch(actSearchWards(searchValue));
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
    dispatch(actSearchWards(keyword));
  };

  const handleClickBanAccount = account => {
    handleClickOpen();
    setBanUsername(account);
  };
  // const handleBanAccount = () => {
  //   dispatch(showLoadingChildren());
  //   callAPI(`Account/ChangeAccountStatus/${banUsername.username}`, 'PUT', null)
  //     .then(res => {
  //       if (res.data) {
  //         toastSuccess(
  //           banUsername.status === 1
  //             ? 'Khóa thành công !'
  //             : 'Mở khóa thành công !'
  //         );
  //         dispatch(hideLoadingChildren());
  //         setValue(!value);
  //         handleClose();
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };
  const handleEventImport = data => {
    dispatch(showLoading());
    console.log(data);
    Axios.post(`http://leminhnhan.cosplane.asia/api/Ward/addWard/${districtId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());
          toastSuccess('Import thành công !');
          setValue(!value);
        } else {
          dispatch(hideLoading());
          toastError('Import thất bạn !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Page className={classes.root} title="Quản lý địa chỉ">
      <AuthGuard roles={['Quản lý']} />
      <Header onAddEvent={handleEventImport} />
      <BackHeader/>
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {wardsStore && (
        <Results
          onBan={handleClickBanAccount}
          className={classes.results}
          wards={wardsStore}
        />
      )}

      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <GoblaLoadingChildren />
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontSize: 20 }}>
            {banUsername.status === 1 ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {banUsername.status === 1
              ? 'Bạn có chắc chắn muốn khóa tài khoản này! Việc khóa tài khoản đồng nghĩa với việc người dùng không thể sử dụng đăng nhập được vào hệ thống !'
              : 'Bạn có chắc chắn muốn mở khóa tài khoản này! Việc mở tài khoản đồng nghĩa với việc cho phép người dùng đăng nhập vào được hệ thống !'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button onClick={handleBanAccount} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog> */}
    </Page>
  );
};

export default WardPage;
