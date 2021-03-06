import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
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
import firebase from '../../firebase/firebase';
import moment from 'moment';

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
    setReason("")
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
  //           toastSuccess('Th??m th??nh c??ng !');
  //           setValue(!value);
  //           setEventModal({
  //             open: false,
  //             event: null
  //           });
  //         } else {
  //           dispatch(hideLoadingChildren());
  //           toastError('Th??m th???t b???i !');
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
  //         toastSuccess('C???p nh???t th??nh c??ng !');
  //         setValue(!value);

  //         setEventModal({
  //           open: false,
  //           event: null
  //         });
  //       } else {
  //         dispatch(hideLoadingChildren());
  //         toastError('C???p nh???t th???t b???i !');
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
          toastSuccess('Ch???p nh???n th??nh c??ng !');
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: selectedItem.username,
            isSeen: false,
            title:
              'L???ch th??m v?????n ng??y ' +
              selectedItem.searchDate +
              ' t???i ' +
              selectedItem.gardenName +
              ' c???a b???n ???? ???????c n??ng d??n ch???p nh???n.',
            type: 'visit',
            created: moment().toISOString()
          };
          dbCon.push(noti);
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
    console.log(reason);
    dispatch(showLoadingChildren());
    callAPI(`VisitingSchedule/rejectVisit/${selectedItem.id}`, 'PUT', null)
      .then(res => {
        if (res.data) {
          dispatch(hideLoadingChildren());
          setValue(!value);
          handleCloseReject();
          toastSuccess('T??? ch???i th??nh c??ng !');
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: selectedItem.username,
            isSeen: false,
            title:
              'L???ch th??m v?????n ng??y ' +
              selectedItem.searchDate +
              ' t???i ' +
              selectedItem.gardenName +
              ' c???a b???n ???? b??? n??ng d??n t??? ch???i v??: ' +
              reason,
            type: 'visit',
            created: moment().toISOString()
          };
          dbCon.push(noti);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [reason, setReason] = useState('');
  const handleChange = event => {
    setReason(event.target.value);
  };
  return (
    <Page className={classes.root} title="Y??u c???u th??m v?????n">
      <AuthGuard roles={['N??ng d??n']}></AuthGuard>
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
          <p style={{ fontSize: 20 }}>X??c nh???n y??u c???u</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            B???n c?? ch???c ch???n mu???n x??c nh???n y??u c???u th??m v?????n n??y c???a kh??ch h??ng
            !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>H???y b???</Button>
          <Button onClick={handleAccpet} color="primary" autoFocus>
            ?????ng ??
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
          <p style={{ fontSize: 20 }}>T??? ch???i y??u c???u</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            B???n c?? ch???c ch???n mu???n t??? ch???i y??u c???u th??m v?????n n??y c???a kh??ch h??ng !
          </DialogContentText>
          <TextField
            className={classes.field}
            multiline
            fullWidth
            error={reason.length > 200}
            
            helperText={
              reason.length > 200 ? "T???i ??a 200 k?? t???" : null
            }
            // helperText={hasError('name') ? formState.errors.name[0] : null}
            label="L?? do t??? ch???i"
            name="reason"
            onChange={handleChange}
            value={reason || ''}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReject}>H???y b???</Button>
          <Button
            onClick={handleReject}
            disabled={reason === '' || reason.length > 200}
            color="primary"
            autoFocus>
            ?????ng ??
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default ManageVisitingPage;
