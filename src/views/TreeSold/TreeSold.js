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
import { actFetchSold, actSearchSold } from 'actions/treeSold';

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

const TreeSold = () => {
  const [value, setValue] = useState(true); // integer state
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [searchValue, setSearchValue] = useState('');
  const treeSoldStore = useSelector(state => state.treeSold);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('reden');
    dispatch(showLoading());
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    // console.log(username)
    callAPI(`Tree/getSoldTree/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          // fetch(
          //   `http://127.0.0.1:4000/send-text?recipient=${'840985900614'}&textmessage=${'text.textmessage'}`
          // ).catch(err => console.error(err));
          dispatch(actFetchSold(res.data));
          dispatch(actSearchSold(searchValue));
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
  //         toastError('Cập nhật thất bại ! Vì có vườn thuộc loại cây này đang hoạt động');
  //       }
  //     }
  //   });
  // };

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setSearchValue(keyword);
    setResetPage(!resetPage);
    dispatch(actSearchSold(keyword));
  };


  return (
    <Page className={classes.root} title="Cây">
      <AuthGuard roles={['Nông dân']}></AuthGuard>
      <Header />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      {treeSoldStore && (
        <Results
          resetPage={resetPage}
          className={classes.results}
          plantTypes={treeSoldStore}
          // onEditEvent={handleEventOpenEdit}
        />
      )}
    
    </Page>
  );
};

export default TreeSold;
