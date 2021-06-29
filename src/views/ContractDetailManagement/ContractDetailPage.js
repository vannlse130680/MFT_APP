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
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import callAPI from 'utils/callAPI';
import { toastError, toastSuccess } from 'utils/toastHelper';
import useRouter from 'utils/useRouter';
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
            toastSuccess('Thêm thành công !');
            setValue(!value);
            setEventModal({
              open: false,
              event: null
            });
          } else {
            dispatch(hideLoadingChildren());
            toastError('Thêm thất bại !');
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
          toastSuccess('Cập nhật thành công !');
          setValue(!value);

          setEventModal({
            open: false,
            event: null
          });
        } else {
          dispatch(hideLoadingChildren());
          toastError('Cập nhật thất bại !');
        }
      }
    });
  };
  const handLeEditYield = data => {
    callAPI('ContractDetail/updateHarvetYield', 'PUT', data).then(res => {
      if (res.status === 200) {
        if (res.data) {
          dispatch(hideLoadingChildren());
          toastSuccess('Cập nhật thành công !');
          setValue(!value);

          setEventModal({
            open: false,
            event: null
          });
        } else {
          dispatch(hideLoadingChildren());
          toastError('Cập nhật thất bại !');
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
          toastSuccess('Cập nhật thành công !');
          setValue(!value);

          setEventModal({
            open: false,
            event: null
          });
          handleClose();
        } else {
          dispatch(hideLoadingChildren());
          toastError('Cập nhật thất bại !');
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
          toastSuccess('Cập nhật thành công !');
          setValue(!value);

          handleCloseAccept();
        } else {
          dispatch(hideLoadingChildren());
          toastError('Cập nhật thất bại !');
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
          toastSuccess('Từ chối thành công !');
          setValue(!value);

          setEventModal({
            open: false,
            event: null
          });
          handleCloseDeny();
        } else {
          dispatch(hideLoadingChildren());
          toastError('Từ chối thất bại !');
          handleCloseDeny();
        }
      }
    });
  };
  return (
    <Page className={classes.root} title="Quản lý hợp đồng">
      <AuthGuard roles={['Nông dân']}></AuthGuard>
      {props.contractStatus === 1 ? (
        <div>
          <Header onAddEvent={handleEventNew} />
          <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
          {contractDetailStore && (
            <Results
              contractId={router.match.params.id}
              onAcceptAll={handleClickAcceptAll}
              onAcceptDeliveryDate={handleClickAcceptDeliveryDate}
              onDenyDeliveryDate={handleClickDenyDeliveryDate}
              resetPage={resetPage}
              className={classes.results}
              contractDetails={contractDetailStore}
              onEditEvent={handleEventOpenEdit}
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
              <p style={{ fontSize: 20 }}>Xác nhận ngày giao hàng</p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bạn có chắn chắn muốn xác nhận ngày giao hàng của khách hàng!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleClose}>
                Đóng
              </Button>
              <Button color="primary" onClick={handleAcceptDeliveryDate}>
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            onClose={handleCloseDeny}
            open={openDeny}>
            <DialogTitle id="alert-dialog-title">
              <p style={{ fontSize: 20 }}>Từ chối ngày giao hàng</p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bạn có chắn chắn muốn từ chối ngày giao hàng của khách hàng!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseDeny}>
                Đóng
              </Button>
              <Button color="primary" onClick={handleDenyDeliveryDate}>
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            onClose={handleCloseAccept}
            open={openAccept}>
            <DialogTitle id="alert-dialog-title">
              Hoàn thành chi tiết hợp đồng
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p style={{ fontSize: 20 }}>
                  Bạn có chắn chắn muốn hoàn thành chi tiết hợp đồng này!
                </p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseAccept}>
                Đóng
              </Button>
              <Button color="primary" onClick={handleAcceptAll}>
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : props.contractStatus === 2 ? (
        <Alert
          className={classes.alert}
          variant="warning"
          message="Hợp đồng đã bị hủy!"
        />
      ) : props.contractStatus === 4 ? (
        <Alert
          className={classes.alert}
          variant="warning"
          message="Hợp đồng đang trong trạng thái chờ xác nhận hủy!"
        />
      ) : (
        <Alert
          className={classes.alert}
          message="Hợp đồng chưa được xác nhận!"
        />
      )}
    </Page>
  );
};

export default ContractDetailPage;
