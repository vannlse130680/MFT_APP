import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  hideLoadingChildren,
  showLoadingChildren
} from 'actions/childrenLoading';
import {
  actFetchContractDetail,
  actSearchContractDetail
} from 'actions/contractDetail';
import { hideLoading, showLoading } from 'actions/loading';
import { actFetchPlantTypes, actSearchPlantTypes } from 'actions/plantType';

import { Alert, AuthGuard, Page, SearchBar } from 'components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from 'utils/callAPI';
import { toastError, toastSuccess } from 'utils/toastHelper';
import useRouter from 'utils/useRouter';
import AddEditEvent from './components/AddEditEvent';
import Header from './components/Header';
import Results from './components/Result/Results';
import firebase from '../../firebase/firebase';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  alert: {
    marginBottom: 10
  }
}));

const ContractDetailPage = props => {
  const [value, setValue] = useState(true); // integer state
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [openAccept, setOpenAccept] = React.useState(false);

  const handleClickOpenAccept = () => {
    setOpenAccept(true);
  };

  const handleCloseAccept = () => {
    setOpenAccept(false);
  };

  const [openDeny, setOpenDeny] = React.useState(false);

  const handleClickOpenDeny = () => {
    setOpenDeny(true);
  };

  const handleCloseDeny = () => {
    setOpenDeny(false);
  };
  const [searchValue, setSearchValue] = useState('');
  const [contractDetailId, setContractDetailId] = useState('');
  const contractDetailStore = useSelector(state => state.contractDetail);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());

    callAPI(
      `ContractDetail/getContractDetailByContractID/${router.match.params.id}`,
      'GET',
      null
    )
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);

          props.onComplete();

          dispatch(actFetchContractDetail(res.data));
          dispatch(actSearchContractDetail(searchValue));
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

  const handleFilter = () => {};
  const handleSearch = keyword => {
    setSearchValue(keyword);
    setResetPage(!resetPage);
    dispatch(actSearchContractDetail(keyword));
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
  const handleEditDate = data => {
    console.log(data);
    callAPI('ContractDetail/updateHarvetDateRange', 'PUT', data).then(res => {
      if (res.status === 200) {
        if (res.data) {
          dispatch(hideLoadingChildren());
          toastSuccess('C???p nh???t th??nh c??ng !');
          setValue(!value);
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: props.contractInfomation.customerUsername,
            isSeen: false,
            title:
              'H???p ?????ng s??? ' +
              props.contractInfomation.contractNumber +
              ' c???a b???n ???? c???p nh???t th???i gian c?? th??? thu ho???ch c???a v??? m??a m???i.',
            type: 'contract',
            created: moment().toISOString()
          };
          dbCon.push(noti);
          setEventModal({
            open: false,
            event: null
          });
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
  const handLeEditYield = data => {
    callAPI('ContractDetail/updateHarvetYield', 'PUT', data).then(res => {
      if (res.status === 200) {
        if (res.data) {
          dispatch(hideLoadingChildren());
          toastSuccess('C???p nh???t th??nh c??ng !');
          setValue(!value);
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: props.contractInfomation.customerUsername,
            isSeen: false,
            title:
              'H???p ?????ng s??? ' +
              props.contractInfomation.contractNumber +
              ' c???a b???n ???? c???p nh???t s???n l?????ng (d??? ki???n) thu ho???ch.',
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
          toastError('C???p nh???t th???t b???i !');
        }
      }
    });
  };

  const handleClickAcceptDeliveryDate = id => {
    setContractDetailId(id);
    handleClickOpen();
  };
  const handleAcceptDeliveryDate = () => {
    dispatch(showLoadingChildren());
    callAPI(
      `ContractDetail/confirmDeliveryDate/${contractDetailId}`,
      'PUT',
      null
    ).then(res => {
      if (res.status === 200) {
        if (res.data) {
          dispatch(hideLoadingChildren());
          toastSuccess('C???p nh???t th??nh c??ng !');
          setValue(!value);
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: props.contractInfomation.customerUsername,
            isSeen: false,
            title:
              'Y??u c???u ng??y giao c???a h???p ?????ng s??? ' +
              props.contractInfomation.contractNumber +
              ' c???a b???n ???? ???????c n??ng d??n x??c nh???n.',
            type: 'contract',
            created: moment().toISOString()
          };
          dbCon.push(noti);
          setEventModal({
            open: false,
            event: null
          });
          handleClose();
        } else {
          dispatch(hideLoadingChildren());
          toastError('C???p nh???t th???t b???i !');
          handleClose();
        }
      }
    });
  };
  const handleClickAcceptAll = id => {
    setContractDetailId(id);
    handleClickOpenAccept();
  };
  const handleAcceptAll = () => {
    dispatch(showLoadingChildren());
    var data = {
      contractDetailID: contractDetailId,
      contractID: parseInt(router.match.params.id)
    };
    console.log(data);
    callAPI('ContractDetail/confirmCrop', 'PUT', data).then(res => {
      if (res.status === 200) {
        if (res.data) {
          dispatch(hideLoadingChildren());
          toastSuccess('C???p nh???t th??nh c??ng !');
          setValue(!value);
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: props.contractInfomation.customerUsername,
            isSeen: false,
            title:
              'M??a v??? hi???n t???i c???a h???p ?????ng s??? ' +
              props.contractInfomation.contractNumber +
              ' c???a b???n ???? thu ho???ch v?? chuy???n cho giao h??ng.',
            type: 'contract',
            created: moment().toISOString()
          };
          dbCon.push(noti);
          handleCloseAccept();
        } else {
          dispatch(hideLoadingChildren());
          toastError('C???p nh???t th???t b???i !');
          handleCloseAccept();
        }
      }
    });
  };
  const handleClickDenyDeliveryDate = id => {
    setContractDetailId(id);
    handleClickOpenDeny();
  };
  const handleDenyDeliveryDate = () => {
    dispatch(showLoadingChildren());
    callAPI(
      `ContractDetail/rejectDeliveryDate/${contractDetailId}`,
      'PUT',
      null
    ).then(res => {
      if (res.status === 200) {
        if (res.data) {
          dispatch(hideLoadingChildren());
          toastSuccess('T??? ch???i th??nh c??ng !');
          setValue(!value);
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: props.contractInfomation.customerUsername,
            isSeen: false,
            title:
              'Y??u c???u ng??y giao c???a h???p ?????ng s??? ' +
              props.contractInfomation.contractNumber +
              ' c???a b???n ???? b??? n??ng d??n t??? ch???i v??: ' +
              reason,
            type: 'contract',
            created: moment().toISOString()
          };
          dbCon.push(noti);
          setEventModal({
            open: false,
            event: null
          });
          handleCloseDeny();
        } else {
          dispatch(hideLoadingChildren());
          toastError('T??? ch???i th???t b???i !');
          handleCloseDeny();
        }
      }
    });
  };
  const handleEventOpenEditDate = plantType => {
    setSelectedPlantType(plantType);
    setEventModal({
      open: true,
      event: 1
    });
  };
  const handleEventOpenYieldDate = plantType => {
    setSelectedPlantType(plantType);
    setEventModal({
      open: true,
      event: 2
    });
  };
  const [reason, setReason] = useState('');
  const handleChange = event => {
    setReason(event.target.value);
  };
  return (
    <Page className={classes.root} title="Qu???n l?? h???p ?????ng">
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
          <Header onAddEvent={handleEventNew} />
          <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
          {contractDetailStore && (
            <Results
              contractStatus={props.contractStatus}
              contractId={router.match.params.id}
              onAcceptAll={handleClickAcceptAll}
              onAcceptDeliveryDate={handleClickAcceptDeliveryDate}
              onDenyDeliveryDate={handleClickDenyDeliveryDate}
              resetPage={resetPage}
              className={classes.results}
              contractDetails={contractDetailStore}
              onEditEvent={handleEventOpenEdit}
              onEditDateEvent={handleEventOpenEditDate}
              onEditYieldEvent={handleEventOpenYieldDate}
            />
          )}
          <Modal onClose={handleModalClose} open={eventModal.open}>
            <AddEditEvent
              selectedContractDetail={selectedPlantType}
              isUpdateDate={selectedPlantType.deliveryDate === ''}
              customerUsername={props.customerUsername}
              event={eventModal.event}
              onAdd={handleEventAdd}
              onCancel={handleModalClose}
              onDelete={handleEventDelete}
              onEditDate={handleEditDate}
              onEditYield={handLeEditYield}
            />
          </Modal>
          <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            onClose={handleClose}
            open={open}>
            <DialogTitle id="alert-dialog-title">
              <p style={{ fontSize: 20 }}>X??c nh???n ng??y giao h??ng</p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                B???n c?? ch???c ch???n mu???n x??c nh???n ng??y giao h??ng c???a kh??ch h??ng!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleClose}>
                ????ng
              </Button>
              <Button color="primary" onClick={handleAcceptDeliveryDate}>
                ?????ng ??
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            onClose={handleCloseDeny}
            open={openDeny}>
            <DialogTitle id="alert-dialog-title">
              <p style={{ fontSize: 20 }}>T??? ch???i ng??y giao h??ng</p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                B???n c?? ch???c ch???n mu???n t??? ch???i ng??y giao h??ng c???a kh??ch h??ng!
              </DialogContentText>
              <TextField
                className={classes.field}
                multiline
                fullWidth
                error={reason.length > 200}
                helperText={reason.length > 200 ? 'T???i ??a 200 k?? t???' : null}
                // helperText={hasError('name') ? formState.errors.name[0] : null} test
                label="L?? do t??? ch???i"
                name="reason"
                onChange={handleChange}
                value={reason || ''}
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseDeny}>
                ????ng
              </Button>
              <Button
                color="primary"
                onClick={handleDenyDeliveryDate}
                disabled={reason === '' || reason.length > 200}>
                ?????ng ??
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            onClose={handleCloseAccept}
            open={openAccept}>
            <DialogTitle id="alert-dialog-title">
              <p style={{ fontSize: 20 }}>Ho??n th??nh chi ti???t h???p ?????ng</p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                B???n c?? ch???c ch???n mu???n ho??n th??nh chi ti???t h???p ?????ng n??y!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseAccept}>
                ????ng
              </Button>
              <Button color="primary" onClick={handleAcceptAll}>
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

export default ContractDetailPage;
