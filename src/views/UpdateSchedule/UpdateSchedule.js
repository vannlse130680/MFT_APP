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
import { hideLoadingChildren } from 'actions/childrenLoading';
import { hideLoading, showLoading } from 'actions/loading';
import { actFetchPlantTypes, actSearchPlantTypes } from 'actions/plantType';
import {
  actFetchSchedulesCollect,
  actSearchSchedulesCollect
} from 'actions/schedulesCollect';

import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from 'utils/callAPI';
import { toastError, toastSuccess } from 'utils/toastHelper';
import AddEditEvent from './components/AddEditEvent';
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

const UpdateSchedule = () => {
  const [value, setValue] = useState(true); // integer state
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [searchValue, setSearchValue] = useState('');
  const schedulesCollectStore = useSelector(state => state.schedulesCollect);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());

    callAPI(
      'ContractDetail/getAllDeliveryScheduleToFinishContract',
      'GET',
      null
    )
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchSchedulesCollect(res.data));
          dispatch(actSearchSchedulesCollect(searchValue));
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
  const [selectedPlantType, setSelectedPlantType] = useState({});
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
    console.log(data);
    callAPI('PlantType/addPlantType', 'POST', data)
      .then(res => {
        if (res.status === 200) {
          if (res.data) {
            dispatch(hideLoadingChildren());
            toastSuccess('Th??m th??nh c??ng !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren());
            toastError('Th??m th???t b???i !');
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
    callAPI('PlantType/updatePlantType', 'PUT', data).then(res => {
      if (res.status === 200) {
        if (res.data) {
          dispatch(hideLoadingChildren());
          toastSuccess('C???p nh???t th??nh c??ng !');
          setValue(!value);

          setEventModal({
            open: false,
            event: null
          });
        } else {
          dispatch(hideLoadingChildren());
          toastError('C???p nh???t th???t b???i !');
        }
      }
    });
  };

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setSearchValue(keyword);
    setResetPage(!resetPage);
    dispatch(actSearchSchedulesCollect(keyword));
  };
  const handleEventNew = () => {
    setSelectedPlantType(null);
    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = schedule => {
    setSelectedPlantType(schedule);
    console.log(schedule);
    callAPI(
      `PackageDelivery/checkContractDetailCanFinshOrNot/${schedule.id}`,
      'GET',
      null
    ).then(res => {
      if (res.status === 200) {
        if (res.data) {
          console.log('hahaha');
          dispatch(showLoading());
          callAPI(
            `ContractDetail/updateDeliveryCrop/${schedule.id}`,
            'PUT',
            null
          ).then(res => {
            if (res.status === 200) {
              dispatch(hideLoading());
              toastSuccess('C???p nh???t th??nh c??ng !');
              let dbCon = firebase.database().ref('/notification/');
              var noti = {
                farmer: schedule.farmerUsername,
                isSeen: false,
                title:
                  'M??a v??? ng??y ' +
                  moment(schedule.delivery)
                    .add(1, 'day')
                    .format('DD/MM/YYYY') +
                  ' c???a h???p ?????ng s??? ' +
                  schedule.contractNumber +
                  ' c???a b???n ???? giao h??ng th??nh c??ng.',
                type: 'contract',
                created: moment().toISOString()
              };
              dbCon.push(noti);
              setValue(!value);
            }
          });
        } else {
          handleClickOpen();
        }
      }
    });
  };

  return (
    <Page className={classes.root} title="C???p nh???t v???n chuy???n">
      <AuthGuard roles={['Shipper']}></AuthGuard>
      <Header onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {schedulesCollectStore && (
        <Results
          resetPage={resetPage}
          className={classes.results}
          schedules={schedulesCollectStore}
          onEditEvent={handleEventOpenEdit}
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
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        onClose={handleClose}
        open={open}>
        <DialogTitle id="alert-dialog-title">X??c nh???n</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            B???n kh??ng th??? x??c nh???n l???ch v??n chuy???n v?? ch??a giao th??nh c??ng t???t
            c??c ????n h??ng
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            ????ng
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default UpdateSchedule;
