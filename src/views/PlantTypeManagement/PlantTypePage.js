import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { hideLoading, showLoading } from 'actions/loading';
import { actFetchPlantTypes, actSearchPlantTypes } from 'actions/plantType';

import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from 'utils/callAPI';
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
  const plantTypesStore = useSelector(state => state.plantTypes);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('reden');
    dispatch(showLoading());
    var username = JSON.parse(localStorage.getItem('USER')).username;
    // console.log(username)
    callAPI(`planttype/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchPlantTypes(res.data));
          dispatch(hideLoading());
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [value]);

  const classes = useStyles();

  const [events, setEvents] = useState([]);
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
    callAPI('PlantType/addPlantTree', 'POST', data)
      .then(res => {
        if (res.status === 200) {
          setValue(!value);
          setEventModal({
            open: false,
            event: null
          });
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
        setValue(!value);
        setEventModal({
          open: false,
          event: null
        });
      }
    });
  };

  const handleFilter = () => {};
  const handleSearch = keyword => {
    dispatch(actSearchPlantTypes(keyword));
    // var arr = plantTypesStore;

    // var result = filterByValue(arr, keyword);

    // if (keyword && keyword.trim() !== '') {
    //   setPlantTypes(result);
    // } else {
    //   setPlantTypes(plantTypesStore);
    // }
    // // console.log(gardens)
  };
  const handleEventNew = () => {
    setSelectedPlantType(null);
    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = plantType => {
    setSelectedPlantType(plantType);
    setEventModal({
      open: true,
      event: {}
    });
  };
  return (
    <Page className={classes.root} title="Quản lý loại cây">
      <AuthGuard roles={['FARMER']}></AuthGuard>
      <Header onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {plantTypesStore && (
        <Results
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
    </Page>
  );
};

export default PlantTypePage;
