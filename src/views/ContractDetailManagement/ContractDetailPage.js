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
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [searchValue, setSearchValue] = useState('');
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
  const handleEventEdit = data => {
    // setEvents(events => events.map(e => (e.id === event.id ? event : e)));
    console.log(data);
    callAPI('PlantType/updatePlantType', 'PUT', data).then(res => {
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
  return (
    <Page className={classes.root} title="Quản lý hợp đồng">
      <AuthGuard roles={['Nông dân']}></AuthGuard>
      {props.contractStatus === 1 || props.contractStatus === 2 ? (
        <div>
          <Header onAddEvent={handleEventNew} />
          <SearchBar onFilter={handleFilter} onSearch={handleSearch} />
          {contractDetailStore && (
            <Results
              resetPage={resetPage}
              className={classes.results}
              contractDetails={contractDetailStore}
              onEditEvent={handleEventOpenEdit}
            />
          )}
          <Modal onClose={handleModalClose} open={eventModal.open}>
            <AddEditEvent
              selectedContractDetail={selectedPlantType}
              customerUsername={props.customerUsername}
              event={eventModal.event}
              onAdd={handleEventAdd}
              onCancel={handleModalClose}
              onDelete={handleEventDelete}
              onEdit={handleEventEdit}
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
              Chỉnh sửa loại cây
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bạn không thể chỉnh sửa loại cây này vì có cây thuộc loại cây
                này đang trong hợp đồng với khách hàng!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleClose}>
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        </div>
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
