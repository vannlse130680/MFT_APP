import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Modal
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { hideLoadingChildren } from 'actions/childrenLoading';
import { hideLoading, showLoading } from 'actions/loading';
import { actFetchPlantTypes, actSearchPlantTypes } from 'actions/plantType';
import {
  actFetchTreeProcesses,
  actSearchTreeProcesses
} from 'actions/treeProcesses';

import { Alert, AuthGuard, Page, SearchBar } from 'components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import { toastError, toastSuccess } from 'utils/toastHelper';
import useRouter from 'utils/useRouter';
import AddEditEvent from './components/AddEditEvent';
import Header from './components/Header';
import Results from './components/Result/Results';
import firebase from '../../../../../firebase/firebase';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  alert : {
    marginBottom: 10
  }
}));

const TreeProcess = props => {
  console.log(props.contractStatus);
  const [value, setValue] = useState(true); // integer state
  const [searchValue, setSearchValue] = useState(''); // integer state
  const treeProcessesStore = useSelector(state => state.treeProcesses);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(showLoading());

    // console.log(username)
    callAPI(
      `TreeProcess/getAllTreeProcess/${router.match.params.id}`,
      'GET',
      null
    )
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchTreeProcesses(res.data));
          dispatch(actSearchTreeProcesses(searchValue));
          dispatch(hideLoading());
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [value]);

  const classes = useStyles();

  const [events, setEvents] = useState([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteId, setDeleteId] = useState('');
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const [resetPage, setResetPage] = useState(false);
  const [selectedTreeProcess, setSelectedTreeProcess] = useState({});
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
    data.treeID = props.treeId;
    data.contractID = parseInt(router.match.params.id);
    console.log(data);
    callAPI('TreeProcess/addTreeProcess', 'POST', data)
      .then(res => {
        if (res.status === 200) {
          if (res.data) {
            dispatch(hideLoadingChildren());
            toastSuccess('Th??m th??nh c??ng !');
            setValue(!value);
            let dbCon = firebase.database().ref('/notificationApp/');
            var noti = {
              customer: props.contractInfomation.customerUsername,
              isSeen: false,
              title:
                'H???p ?????ng s??? ' +
                props.contractInfomation.contractNumber +
                ' c???a b???n c?? c???p nh???t ti???n tr??nh ch??m s??c c??y m???i.',
              type: 'contract',
              created: moment().toISOString()
            };
            dbCon.push(noti);
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
    data.treeID = props.treeId;
    data.contractID = parseInt(router.match.params.id);

    callAPI('TreeProcess/updateTreeProcess', 'PUT', data).then(res => {
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
    dispatch(actSearchTreeProcesses(keyword));
  };
  const handleEventNew = () => {
    setSelectedTreeProcess(null);
    setEventModal({
      open: true,
      event: null
    });
  };
  const handleEventOpenEdit = treeProcess => {
    setSelectedTreeProcess(treeProcess);
    setEventModal({
      open: true,
      event: {}
    });
  };
  const handleOnClickDelete = id => {
    setDeleteId(id);
    handleClickOpenDelete();
  };
  const handleDeleteAccount = () => {
    callAPI(`TreeProcess/deleteTreeProcess/${deleteId}`, 'DELETE', null)
      .then(res => {
        if (res.data) {
          toastSuccess('X??a th??nh c??ng !');
          setValue(!value);
          dispatch(hideLoadingChildren());
          handleCloseDelete();
        } else {
          dispatch(hideLoadingChildren());
          toastError('X??a th???t b???i !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Page className={classes.root}>
      <AuthGuard roles={['N??ng d??n']}></AuthGuard>
      {props.contractStatus === 1 || props.contractStatus === 5 ? (
        <div>
          {props.contractStatus === 5 ? (
            <Alert
            
              className={classes.alert}
              variant="info"
              message="H???p ?????ng ???? ???????c ho??n th??nh !"
            />
          ) : null}
          <Header
            onAddEvent={handleEventNew}
            contractStatus={props.contractStatus}
          />
          <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
          {treeProcessesStore && (
            <Results
              onClickDelete={handleOnClickDelete}
              resetPage={resetPage}
              className={classes.results}
              treeProcesses={treeProcessesStore}
              onEditEvent={handleEventOpenEdit}
            />
          )}
          <Modal onClose={handleModalClose} open={eventModal.open}>
            <AddEditEvent
              selectedTreeProcess={selectedTreeProcess}
              event={eventModal.event}
              onAdd={handleEventAdd}
              onCancel={handleModalClose}
              onDelete={handleEventDelete}
              onEdit={handleEventEdit}
            />
          </Modal>
          <Dialog
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <GoblaLoadingChildren />
            <DialogTitle id="alert-dialog-title">
              <p style={{ fontSize: 20 }}>X??a</p>
            </DialogTitle>

            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                B???n c?? ch???c ch???n mu???n x??a !
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete}>H???y b???</Button>
              <Button onClick={handleDeleteAccount} color="primary" autoFocus>
                ?????ng ??
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : props.contractStatus === 2 ? (
        <Alert
          className={classes.alert}
          variant="warning"
          message="H???p ?????ng ???? b??? h???y!"
        />
      ) : props.contractStatus === 4 ? (
        <Alert
          className={classes.alert}
          variant="warning"
          message="H???p ?????ng ??ang trong tr???ng th??i ch??? x??c nh???n h???y!"
        />
      ) : (
        <Alert
          className={classes.alert}
          message="H???p ?????ng ch??a ???????c x??c nh???n!"
        />
      )}
    </Page>
  );
};

export default TreeProcess;
