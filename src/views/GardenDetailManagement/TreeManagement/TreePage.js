import { Modal, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import 'react-toastify/dist/ReactToastify.css';
import { AuthGuard, Page, SearchBar } from 'components';
import React, { useEffect, useState } from 'react';





import callAPI from 'utils/callAPI';
import { useDispatch, useSelector } from 'react-redux';

import { hideLoading, showLoading } from 'actions/loading';

import { toastError, toastSuccess } from 'utils/toastHelper';
import TreeHeader from '../Header/TreeHeader';
import Results from './Result/Results';
import AddEditEvent from './AddEditEvent';
import { actFetchTREES } from 'actions/trees';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const TreePage = props => {
  const {gardenId} = props
  const classes = useStyles();
  const [value, setValue] = useState(true); //
  const treesStore = useSelector(state => state.trees);
  const dispatch = useDispatch();
  useEffect(() => {
    
    dispatch(showLoading());
    // var username = JSON.parse(localStorage.getItem('USER')).username;
    // console.log(username)
    callAPI(`tree/${gardenId}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchTREES(res.data));
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

    // callAPI('Garden/addGarden', 'POST', data)
    //   .then(res => {
    //     if (res.status === 200) {
    //       if(res.data) {
    //         toastSuccess("Tạo vườn thành công !")
    //         setValue(!value);
    //         setEventModal({
    //           open: false,
    //           event: null
    //         });
    //       } else {
    //         toastError("Mã vườn đã tồn tại !")
    //       }
         
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
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
    // console.log(data)
    // callAPI('Garden/updateGarden', 'PUT', data).then(res => {
    //   console.log(res)
    //   if (res.status === 200) {
    //     if(res.data) {
    //       toastSuccess("Cập nhật vườn thành công !")
    //       setValue(!value);
    //       setEventModal({
    //         open: false,
    //         event: null
    //       });
    //     } else {
    //       toastError("Mã vườn đã tồn tại !")
    //     }
    //   }
    // }).catch((err) => {
    //   console.log(err)
    // });
  };

  
  const handleFilter = () => {};
  const handleSearch = keyword => {
    // setResetPage(!resetPage)
    // dispatch(actSearchGardens(keyword));
  };
  const handleEventNew = () => {
    setSelectedGarden(null)
    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = (garden) => {
    garden.plantTypeObj = {
      id: garden.plantTypeID,
      plantTypeName: garden.plantTypeName
    }
    setSelectedGarden(garden)
    setEventModal({
      open: true,
      event: {}
    });
  };

 
  return (
    <Page
      className={classes.root}
      title="Garden Management"
    >
      
      <AuthGuard roles={['FARMER']} />
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      <TreeHeader onAddEvent={handleEventNew} />
      
      {treesStore && (
        <Results
          
          className={classes.results}
          trees={treesStore}
          onEditEvent={handleEventOpenEdit}
        />
      )}
      <Modal
        onClose={handleModalClose}
        open={eventModal.open}
      >
        <AddEditEvent
          event={eventModal.event}
          selectedGarden={selectedGarden}
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

export default TreePage;
