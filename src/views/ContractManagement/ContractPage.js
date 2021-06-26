import {
  Modal,
  Button,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Dialog
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import 'react-toastify/dist/ReactToastify.css';
import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import AddEditEvent from './components/AddEditEvent';
import Header from './components/Header';
import Results from './components/Result/Results';

import Axios from 'axios';
import callAPI from 'utils/callAPI';
import { useDispatch, useSelector } from 'react-redux';
import { login } from 'actions';
import { hideLoading, showLoading } from 'actions/loading';
import { actFetchContracts, actSearchContracts } from 'actions/contracts';
import { toastError, toastSuccess } from 'utils/toastHelper';
import { actSearchPlantTypes } from 'actions/plantType';
import { hideLoadingChildren } from 'actions/childrenLoading';
import { DialogContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const ContractPage = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [searchValue, setSearchValue] = useState('');
  const [value, setValue] = useState(true); //
  const contractsStore = useSelector(state => state.contracts);
  // const [contractList , setContractList] = useState([])
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    // console.log(username)
    callAPI(`contract/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          // dispatch(actFetchGardens(res.data));
          dispatch(actFetchContracts(res.data));
          dispatch(actSearchContracts(searchValue));
          console.log(res.data);
          dispatch(hideLoading());
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [value]);

  // const [gardens, setGardens] = useState(initGardensValue);
  const [events, setEvents] = useState([]);
  const [resetPage, setResetPage] = useState(false);
  const [selectedContract, setSelectedContract] = useState({});
  const [eventModal, setEventModal] = useState({
    open: false,
    event: null
  });

  const handleModalClose = () => {
    setEventModal({
      open: false,
      event: null
    });
  };

  const handleEventEdit = data => {
    console.log(data);
    callAPI('Contract/UpdateContract', 'PUT', data)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          if (res.data) {
            dispatch(hideLoadingChildren());
            toastSuccess('Cập nhật thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren());
            toastError('Cập nhật thất bại !');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setResetPage(!resetPage);
    setSearchValue(keyword);
    dispatch(actSearchContracts(keyword));
  };
  const handleEventNew = () => {
    setSelectedContract(null);
    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = contract => {
    if (contract.status === 1 || contract.status === 2 || contract.status === 3) {
      handleClickOpen();
    } else {
      setSelectedContract(contract);
      setEventModal({
        open: true,
        event: {}
      });
    }
  };

  return (
    <Page className={classes.root} title="Quản lý hợp đồng">
      <AuthGuard roles={['Nông dân']} />
      <Header onAddEvent={handleEventNew} />

      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {contractsStore && (
        <Results
          contracts={contractsStore}
          className={classes.results}
          onEditEvent={handleEventOpenEdit}
        />
      )}
      <Modal onClose={handleModalClose} open={eventModal.open}>
        <AddEditEvent
          event={eventModal.event}
          selectedContract={selectedContract}
          // onAdd={handleEventAdd}
          onCancel={handleModalClose}
          // onDelete={handleEventDelete}
          onEdit={handleEventEdit}
        />
      </Modal>
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        onClose={handleClose}
        open={open}>
        <DialogTitle id="alert-dialog-title">Chỉnh sửa hợp đồng</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn không thể chỉnh sửa hợp đồng ở trạng thái này!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Button variant="text" color="default" onClick={handleonClick}> a</Button> */}
    </Page>
  );
};

export default ContractPage;
