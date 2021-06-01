import { Modal, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';
import AddEditEvent from './components/AddEditEvent';
import Header from './components/Header';
import Results from './components/Result/Results';

import Axios from 'axios';
import callAPI from 'utils/callAPI';
import { useDispatch, useSelector } from 'react-redux';
import { login } from 'actions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const GardenPage = () => {
  const classes = useStyles();
  const initGardensValue = [
    {
      id: 1,
      name: 'Vườn trái cây Long Khánh',
      address: 'Đồng Nai',
      status: 'completed',
      plantTypeName: 'Xoài'
    },
    {
      id: 2,
      name: 'Vườn trái cây Trung An',
      address: 'Củ Chi',
      status: 'completed',
      plantTypeName: 'Cam'
    },
    {
      id: 3,
      name: 'Khu du lịch Cồn Phụng',
      address: 'Bến Tre',
      status: 'pending',
      plantTypeName: 'Mận'
    },
    {
      id: 4,
      name: 'Miệt vườn Vĩnh Kim',
      address: 'Tiền Giang',
      status: 'pending',
      plantTypeName: 'Dừa'
    }
  ];
  const [gardens, setGardens] = useState(initGardensValue);
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
  const handleEventAdd = event => {
    setEvents(events => [...events, event]);
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

  function filterByValue(array, string) {
    return array.filter(o =>
      Object.keys(o).some(k =>
        o[k]
          .toString()
          .toLowerCase()
          .includes(string.trim().toLowerCase())
      )
    );
  }
  const handleFilter = () => {};
  const handleSearch = keyword => {
    var arr = initGardensValue;

    var result = filterByValue(arr, keyword);

    if (keyword && keyword.trim() !== '') {
      setGardens(result);
    } else {
      setGardens(initGardensValue);
    }
    // console.log(gardens)
  };
  const handleEventNew = () => {
    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = () => {
    setEventModal({
      open: true,
      event: {}
    });
  };

  useEffect(() => {
    // console.log('hahaha');
    // callAPI("Account", "GET", null).then((res) => {
    //   console.log(res)
    // })
    // Axios.get('https://localhost:44316/api/Account').then(response => {
    //   console.log(response);

    // });
  });
  // const dispatch = useDispatch()
  // const handleonClick = () => {
   
  //   dispatch(login())
  // }
  // const counter = useSelector((state) => state.session)
  // console.log(counter)
  return (
    <Page className={classes.root} title="Garden Management">
      <AuthGuard roles={['FARMER']}></AuthGuard>
      <Header onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {gardens && (
        <Results
          className={classes.results}
          gardens={gardens}
          onEditEvent={handleEventOpenEdit}
        />
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
      {/* <Button variant="text" color="default" onClick={handleonClick}> a</Button> */}
    </Page>
  );
};

export default GardenPage;
