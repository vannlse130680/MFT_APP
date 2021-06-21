import {
  Modal,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
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
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = React.useState(false);
 
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
          dispatch(actSearchTREES(searchValue));
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
            dispatch(hideLoadingChildren());
            toastSuccess('Tạo cây thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren());
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
            dispatch(hideLoadingChildren());
            toastSuccess('Cập nhật cây thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren());
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
    setSearchValue(keyword)
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
    if (tree.status === 2 || tree.status === 3) {
      handleClickOpen();
    } else {
      setSelectedTree(tree);
      setEventModal({
        open: true,
        event: {}
      });
    }
  };

  return (
    <Page className={classes.root} title="Quản lý cây">
      <AuthGuard roles={['Nông dân']} />
      <TreeHeader onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
      

      {treesStore && (
        <Results
          className={classes.results}
          onEditEvent={handleEventOpenEdit}
          trees={treesStore}
        />
      )}
      <Modal
        disableBackdropClick
        onClose={handleModalClose}
        open={eventModal.open}>
        <AddEditEvent
          event={eventModal.event}
          onAdd={handleEventAdd}
          onCancel={handleModalClose}
          onDelete={handleEventDelete}
          onEdit={handleEventEdit}
          selectedTree={selectedTree}
        />
      </Modal>
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        onClose={handleClose}
        open={open}>
        <DialogTitle id="alert-dialog-title">Chỉnh sửa cây</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn không thể chỉnh sửa cây trong trạng thái đã bán hoặc đang trong
            giao dịch!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Button variant="text" color="default" onClick={handleonClick}> a</Button> */}
    </Page>
  );
};

export default TreePage;
