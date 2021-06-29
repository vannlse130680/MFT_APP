import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { actFetchAccounts, actSearchAccounts } from 'actions/accounts';
import {
  hideLoadingChildren,
  showLoadingChildren
} from 'actions/childrenLoading';
import { hideLoading, showLoading } from 'actions/loading';
import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import { toastError, toastSuccess } from 'utils/toastHelper';
import AddEditEvent from './components/AddEditEvent';

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

const ShippAccountPage = () => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openNew, setOpenNew] = React.useState(false);
  const [banUsername, setBanUsername] = useState('');
  const [deleteUsername, setDeleteUsername] = useState('');
  const [eventModal, setEventModal] = useState({
    open: false,
    event: null
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleClickOpenNew = () => {
    setOpenNew(true);
  };

  const handleCloseNew = () => {
    setOpenNew(false);
  };
  const classes = useStyles();
  const [value, setValue] = useState(true); //
  const accountsStore = useSelector(state => state.accounts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());
    var role = 'Shipper';
    callAPI(`Account/GetAccountByRole/${role}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());
          dispatch(actFetchAccounts(res.data));
          dispatch(actSearchAccounts(searchValue));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [value]);

  const [events, setEvents] = useState([]);
  const [resetPage, setResetPage] = useState(false);

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setSearchValue(keyword);
    setResetPage(!resetPage);
    dispatch(actSearchAccounts(keyword));
  };

  // };
  const handleClickBanAccount = customer => {
    handleClickOpen();
    setBanUsername(customer);
  };
  const handleBanAccount = () => {
    dispatch(showLoadingChildren());
    callAPI(`Account/ChangeAccountStatus/${banUsername.username}`, 'PUT', null)
      .then(res => {
        if (res.data) {
          toastSuccess(
            banUsername.status === 1
              ? 'Khóa thành công !'
              : 'Mở khóa thành công !'
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
  const handleEventAdd = data => {
    // setEvents(events => [...events, event]);
    console.log(data);
    callAPI('Account/addShipper', 'POST', data)
      .then(res => {
        if (res.status === 200) {
          if (res.data) {
            dispatch(hideLoadingChildren());
            toastSuccess('Thêm tài khoản thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren());
            toastError('Tên tài khoản đã tồn tại !');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleEventNew = () => {
    // setSelectedPlantType(null);
    if (accountsStore.length === 1) {
      console.log('ko đc');
      handleClickOpenNew()
    } else {
      setEventModal({
        open: true,
        event: null
      });
    }
  };
  const handleModalClose = () => {
    setEventModal({
      open: false,
      event: null
    });
  };
  const handleClickDeleteAccount = username => {
    handleClickOpenDelete();
    setDeleteUsername(username);
  };
  const handleDeleteAccount = () => {
    console.log(deleteUsername);
    dispatch(showLoadingChildren());
    callAPI(`Account/deleteShipper/${deleteUsername}`, 'DELETE', null)
      .then(res => {
        if (res.data) {
          toastSuccess('Xóa thành công !');
          dispatch(hideLoadingChildren());
          setValue(!value);
          handleCloseDelete();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Page className={classes.root} title="Quản lý shipper">
      <AuthGuard roles={['Quản lý']} />
      <Header onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {accountsStore && (
        <Results
          onBan={handleClickBanAccount}
          className={classes.results}
          accounts={accountsStore}
          onDeleteAccount={handleClickDeleteAccount}
        />
      )}
      <Modal onClose={handleModalClose} open={eventModal.open}>
        <AddEditEvent
          // selectedPlantType={selectedPlantType}
          event={eventModal.event}
          onAdd={handleEventAdd}
          onCancel={handleModalClose}

          // onDelete={handleEventDelete}
          // onEdit={handleEventEdit}
        />
      </Modal>

      <Dialog
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
      </Dialog>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <GoblaLoadingChildren />
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontSize: 20 }}>Xóa tài khoản</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa tài khoản giao hàng này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Hủy bỏ</Button>
          <Button onClick={handleDeleteAccount} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNew}
        onClose={handleCloseNew}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <GoblaLoadingChildren />
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontSize: 20 }}>Không thể thêm tài khoản</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn không thể thêm tài khoản giao hàng mới, vì đã tồn tại một tài
            khoản !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNew}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default ShippAccountPage;
