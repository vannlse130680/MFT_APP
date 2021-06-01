import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
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
  const [value, setValue] = useState(0); // integer state
  const plantTypesStore = useSelector(state => state.plantTypes);
  const dispatch = useDispatch();
  useEffect(() => {
    var username = JSON.parse(localStorage.getItem('USER')).username;
    // console.log(username)
    callAPI(`planttype/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchPlantTypes(res.data));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [value]);

  const classes = useStyles();
  // const initGardensValue = [
  //   {
  //     id: 1,
  //     name: 'Xoài cát hòa lộc',
  //     type: 'Xoài',
  //     yield: 100,
  //     crops: 4,
  //     price: 100,
  //     supplier: 'ABC',
  //     status: 'Active'
  //   },
  //   {
  //     id: 2,
  //     name: 'Xoài cát hòa lộc',
  //     type: 'Xoài',
  //     yield: 100,
  //     crops: 4,
  //     price: 100,
  //     supplier: 'ABC',
  //     status: 'Active'
  //   },
  //   {
  //     id: 3,
  //     name: 'Xoài cát hòa lộc',
  //     type: 'Xoài',
  //     yield: 100,
  //     crops: 4,
  //     price: 100,
  //     supplier: 'ABC',
  //     status: 'Active'
  //   }
  // ];

 

  const [events, setEvents] = useState([]);
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
          setValue(1)
          
        }
      })
      .catch(err => {
        console.log(err);
      });
    setEventModal({
      open: false,
      event: null
    });
  };
  const handleEventDelete = event => {
    setEvents(events => events.filter(e => e.id !== event.id));
    setEventModal({
      open: false,
      event: null
    });
  };
  const handleEventEdit = event => {
    setEvents(events => events.map(e => (e.id === event.id ? event : e)));
    setEventModal({
      open: false,
      event: null
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
    setEventModal({
      open: true,
      event: null
    });
  };

  return (
    <Page className={classes.root} title="Quản lý loại cây">
      <AuthGuard roles={['FARMER']}></AuthGuard>
      <Header onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {plantTypesStore && (
        <Results className={classes.results} plantTypes={plantTypesStore} />
      )}
      <Modal onClose={handleModalClose} open={eventModal.open}>
        <AddEditEvent
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
