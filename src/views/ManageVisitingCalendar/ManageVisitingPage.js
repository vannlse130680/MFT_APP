import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  hideLoadingChildren,
  showLoadingChildren
} from 'actions/childrenLoading';
import { hideLoading, showLoading } from 'actions/loading';
import { actFetchVisitings, actSearchVistings } from 'actions/visitings';
import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import { toastSuccess } from 'utils/toastHelper';
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

const ManageVisitingPage = () => {
  const [value, setValue] = useState(true); // integer state
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [openReject, setOpenReject] = React.useState(false);

  const handleClickOpenReject = () => {
    setOpenReject(true);
  };

  const handleCloseReject = () => {
    setOpenReject(false);
  };
  const [searchValue, setSearchValue] = useState('');
  const visitingsStore = useSelector(state => state.visitings);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('reden');
    dispatch(showLoading());
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    // console.log(username)
    callAPI(
      `VisitingSchedule/GetAllVisitingScheduleByUsername/${username}`,
      'GET',
      null
    )
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchVisitings(res.data));
          dispatch(actSearchVistings(searchValue));
          dispatch(hideLoading());
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [value]);

  const classes = useStyles();

  const [events, setEvents] = useState([]);
  const [resetPage, setResetPage] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  // const [eventModal, setEventModal] = useState({
  //   open: false,
  //   event: null
  // });

  // const handleModalClose = () => {
  //   setEventModal({
  //     open: false,
  //     event: null
  //   });
  // };

  // const handleEventAdd = data => {
  //   // setEvents(events => [...events, event]);
  //   console.log(data);
  //   callAPI('PlantType/addPlantType', 'POST', data)
  //     .then(res => {
  //       if (res.status === 200) {
  //         if (res.data) {
  //           dispatch(hideLoadingChildren());
  //           toastSuccess('Thêm thành công !');
  //           setValue(!value);
  //           setEventModal({
  //             open: false,
  //             event: null
  //           });
  //         } else {
  //           dispatch(hideLoadingChildren());
  //           toastError('Thêm thất bại !');
  //         }
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };
  // const handleEventDelete = event => {
  //   setEvents(events => events.filter(e => e.id !== event.id));
  //   setEventModal({
  //     open: false,
  //     event: null
  //   });
  // };
  // const handleEventEdit = data => {
  //   // setEvents(events => events.map(e => (e.id === event.id ? event : e)));
  //   console.log(data);
  //   callAPI('PlantType/updatePlantType', 'PUT', data).then(res => {
  //     if (res.status === 200) {
  //       if (res.data) {
  //         dispatch(hideLoadingChildren());
  //         toastSuccess('Cập nhật thành công !');
  //         setValue(!value);

  //         setEventModal({
  //           open: false,
  //           event: null
  //         });
  //       } else {
  //         dispatch(hideLoadingChildren());
  //         toastError('Cập nhật thất bại !');
  //       }
  //     }
  //   });
  // };

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setSearchValue(keyword);
    setResetPage(!resetPage);
    dispatch(actSearchVistings(keyword));
  };

  const handleClickAccept = data => {
    setSelectedItem(data);
    console.log(data);
    handleClickOpen();
  };
  const handleAccpet = () => {
    dispatch(showLoadingChildren());
    callAPI(`VisitingSchedule/acceptVisit/${selectedItem.id}`, 'PUT', null)
      .then(res => {
        if (res.data) {
          dispatch(hideLoadingChildren());
          setValue(!value);
          handleClose();
          toastSuccess('Chấp nhận thành công !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleClickReject = data => {
    setSelectedItem(data);
    handleClickOpenReject();
  };
  const handleReject = () => {
    dispatch(showLoadingChildren());
    callAPI(`VisitingSchedule/rejectVisit/${selectedItem.id}`, 'PUT', null)
      .then(res => {
        if (res.data) {
          dispatch(hideLoadingChildren());
          setValue(!value);
          handleCloseReject();
          toastSuccess('Từ chối thành công !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Page className={classes.root} title="Yêu cầu thăm vườn">
      <AuthGuard roles={['Nông dân']}></AuthGuard>
      <Header />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {visitingsStore && (
        <Results
          onAccept={handleClickAccept}
          onReject={handleClickReject}
          resetPage={resetPage}
          className={classes.results}
          plantTypes={visitingsStore}
        />
      )}
      {/* <Modal onClose={handleModalClose} open={eventModal.open}>
        <AddEditEvent
          selectedPlantType={selectedPlantType}
          event={eventModal.event}
          onAdd={handleEventAdd}
          onCancel={handleModalClose}
          onDelete={handleEventDelete}
          onEdit={handleEventEdit}
        />
      </Modal> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <GoblaLoadingChildren />
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontSize: 20 }}>Xác nhận yêu cầu</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xác nhận yêu cầu thăm vườn này của khách hàng
            !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button onClick={handleAccpet} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openReject}
        onClose={handleCloseReject}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <GoblaLoadingChildren />
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontSize: 20 }}>Từ chối yêu cầu</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn từ chối yêu cầu thăm vườn này của khách hàng !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReject}>Hủy bỏ</Button>
          <Button onClick={handleReject} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default ManageVisitingPage;
