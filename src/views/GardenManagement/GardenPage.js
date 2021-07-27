import {
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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
import { actFetchGardens, actSearchGardens } from 'actions/gardens';
import { toastError, toastSuccess } from 'utils/toastHelper';
import { actSearchPlantTypes } from 'actions/plantType';
import { hideLoadingChildren } from 'actions/childrenLoading';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const GardenPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const [value, setValue] = useState(true); //
  const gardensStore = useSelector(state => state.gardens);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    // console.log(username)
    callAPI(`garden/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchGardens(res.data));
          dispatch(actSearchGardens(searchValue));
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
  const [selectedGarden, setSelectedGarden] = useState({});
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
  const handleEventAdd = data => {
    // setEvents(events => [...events, event]);

    callAPI('Garden/addGarden', 'POST', data)
      .then(res => {
        if (res.status === 200) {
          if (res.data) {
            dispatch(hideLoadingChildren());
            toastSuccess('Tạo vườn thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren());
            toastError('Mã vườn đã tồn tại  !');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleEventDelete = event => {
    setEvents(events => events.filter(e => e.id !== event.id));
    setEventModal({
      open: false,
      event: null
    });
  };
  const handleEventEdit = data => {
    // setEvents(events => events.map(e => (e.id === event.id ? event : e)));
    console.log(data);
    callAPI('Garden/updateGarden', 'PUT', data)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          if (res.data) {
            dispatch(hideLoadingChildren());
            toastSuccess('Cập nhật vườn thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren());
            toastError('Mã vườn đã tồn tại hoặc hoặc loại cây thuộc vườn này đang tạm ngừng!');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setSearchValue(keyword);
    setResetPage(!resetPage);
    dispatch(actSearchGardens(keyword));
  };
  const handleEventNew = () => {
    setSelectedGarden(null);
    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = garden => {
    callAPI(`Contract/GetContractByGardenId/${garden.id}`, 'GET', null)
      .then(res => {
        console.log(res.data);
        if (res.data.length === 0) {
          garden.plantTypeObj = {
            id: garden.plantTypeID,
            plantTypeName: garden.plantTypeName
          };
          setSelectedGarden(garden);
          setEventModal({
            open: true,
            event: {}
          });
        } else {
          handleClickOpen();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Page className={classes.root} title="Quản lý vườn">
      <AuthGuard roles={['Nông dân']} />
      <Header onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {gardensStore && (
        <Results
          className={classes.results}
          gardens={gardensStore}
          onEditEvent={handleEventOpenEdit}
        />
      )}
      <Modal onClose={handleModalClose} open={eventModal.open}>
        <AddEditEvent
          event={eventModal.event}
          selectedGarden={selectedGarden}
          onAdd={handleEventAdd}
          onCancel={handleModalClose}
          onDelete={handleEventDelete}
          onEdit={handleEventEdit}
        />
      </Modal>
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        onClose={handleClose}
        open={open}>
        <DialogTitle id="alert-dialog-title">Chỉnh sửa vườn</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn không thể chỉnh sửa vườn này vì có cây thuộc vườn này
            đang trong hợp đồng với khách hàng!
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

export default GardenPage;
