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

import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from 'utils/callAPI';
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

const PlantTypePage = () => {
  const [value, setValue] = useState(true); // integer state
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [searchValue, setSearchValue] = useState('');
  const plantTypesStore = useSelector(state => state.plantTypes);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('reden');
    dispatch(showLoading());
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    // console.log(username)
    callAPI(`planttype/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          // fetch(
          //   `http://127.0.0.1:4000/send-text?recipient=${'840985900614'}&textmessage=${'text.textmessage'}`
          // ).catch(err => console.error(err));
          dispatch(actFetchPlantTypes(res.data));
          dispatch(actSearchPlantTypes(searchValue));
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
          toastError('C???p nh???t th???t b???i ! V?? c?? v?????n thu???c lo???i c??y n??y ??ang ho???t ?????ng');
        }
      }
    });
  };

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setSearchValue(keyword);
    setResetPage(!resetPage);
    dispatch(actSearchPlantTypes(keyword));
  };
  const handleEventNew = () => {
    setSelectedPlantType(null);
    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = plantType => {
    callAPI(`Contract/GetContractByPlantTypeId/${plantType.id}`, 'GET', null)
      .then(res => {
        console.log(res.data);
        if (res.data.length === 0) {
          setSelectedPlantType(plantType);
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
    <Page className={classes.root} title="Qu???n l?? lo???i c??y">
      <AuthGuard roles={['N??ng d??n']}></AuthGuard>
      <Header onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {plantTypesStore && (
        <Results
          resetPage={resetPage}
          className={classes.results}
          plantTypes={plantTypesStore}
          onEditEvent={handleEventOpenEdit}
        />
      )}
      <Modal onClose={handleModalClose} open={eventModal.open}>
        <AddEditEvent
          selectedPlantType={selectedPlantType}
          event={eventModal.event}
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
        <DialogTitle id="alert-dialog-title">Ch???nh s???a lo???i c??y</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            B???n kh??ng th??? ch???nh s???a lo???i c??y n??y v?? c?? c??y thu???c lo???i c??y n??y
            ??ang trong h???p ?????ng v???i kh??ch h??ng!
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

export default PlantTypePage;
