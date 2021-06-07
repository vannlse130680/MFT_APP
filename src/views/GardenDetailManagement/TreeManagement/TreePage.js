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
import { actFetchTREES, actSearchTREES } from 'actions/trees';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import { hideLoadingChildren } from 'actions/childrenLoading';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const TreePage = props => {
  const { gardenId } = props;
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
  const [selectedTree, setSelectedTree] = useState({});
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

    callAPI('Tree/addTree', 'POST', data)
      .then(res => {
        if (res.status === 200) {
          if (res.data) {
            dispatch(hideLoadingChildren())
            toastSuccess('Tạo cây thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren())
            toastError('Mã cây đã tồn tại !');
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

    callAPI('Tree/updateTree', 'PUT', data)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          if (res.data) {
            dispatch(hideLoadingChildren())
            toastSuccess('Cập nhật cây thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren())
            toastError('Mã cây đã tồn tại !');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleFilter = () => {};
  const handleSearch = keyword => {
    // setResetPage(!resetPage)
    dispatch(actSearchTREES(keyword));
  };
  const handleEventNew = () => {
    setSelectedTree(null);

    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = tree => {
    console.log(tree);
    setSelectedTree(tree);
    setEventModal({
      open: true,
      event: {}
    });
  };

  return (
    <Page className={classes.root} title="Quản lý cây">
      <AuthGuard roles={['Nông dân']} />
      
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
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
        disableBackdropClick={true}>
        <AddEditEvent
          event={eventModal.event}
          selectedTree={selectedTree}
          onAdd={handleEventAdd}
          onCancel={handleModalClose}
          onDelete={handleEventDelete}
          onEdit={handleEventEdit}>
          
        </AddEditEvent>
        
      </Modal>
      {/* <Button variant="text" color="default" onClick={handleonClick}> a</Button> */}
    </Page>
  );
};

export default TreePage;
