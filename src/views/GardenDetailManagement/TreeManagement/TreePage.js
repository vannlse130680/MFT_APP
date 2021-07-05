import {
  Modal,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  TextField
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
import {
  hideLoadingChildren,
  showLoadingChildren
} from 'actions/childrenLoading';
import { validate } from 'validate.js';
function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  );
  return str;
}
const schema = {
  copyNum: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    numericality: {
      onlyInteger: true,

      greaterThan: 0,
      lessThanOrEqualTo: 100000000,
      message: 'Giá phải lớn 0 và bé hơn 100000000 và là số nguyên'
    }
  }
};
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const TreePage = props => {
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  useEffect(() => {
    const errors = validate(formState.values, schema, { fullMessages: false });

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = React.useState(false);
  const plantTypeName = useSelector(
    state => state.gardenInfor.pt.plantTypeName
  );
  const gardenInfor = useSelector(state => state.gardenInfor);
  const [copyNum, setCopyNum] = useState(0);
  const [openCopy, setOpenCopy] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenCopy = () => {
    setOpenCopy(true);
  };

  const handleCloseCopy = () => {
    setOpenCopy(false);
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
    setSearchValue(keyword);
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
  const handleClickCopy = tree => {
    setFormState({ isValid: false, values: {}, touched: {}, errors: {} });
    setSelectedTree(tree);
    handleClickOpenCopy();
    console.log(tree);
  };
  const handleChange = (event, value) => {
    if (!event) return;

    event.persist();

    if (event.target.name) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [event.target.name]:
            event.target.type === 'checkbox'
              ? event.target.checked
              : event.target.value === ''
              ? null
              : event.target.value
        },
        touched: {
          ...formState.touched,
          [event.target.name]: true
        }
      }));
    }
  };
  const handleCopy = () => {
    async function fetchMyAPI() {
      dispatch(showLoadingChildren());
      var number = parseInt(formState.values.copyNum);
      for (let index = 0; index < number; index++) {
        var data = {
          treeCode:
            'C' +
            removeVietnameseTones(
              plantTypeName
                .split(/\s/)
                .reduce((response, word) => (response += word.slice(0, 1)), '')
            ) +
            Math.floor(100000 + Math.random() * 900000),
          gardenId: parseInt(gardenId),
          price: selectedTree.price,
          standard: selectedTree.standard,
          image: null,
          description: selectedTree.description
        };
        console.log(data);
        await callAPI('Tree/addTree', 'POST', data);
      }
      setValue(!value);
      dispatch(hideLoadingChildren());
      handleCloseCopy();
      toastSuccess('Sao chép thành công !');
    }

    fetchMyAPI();
    console.log(formState.values);
  };
  return (
    <Page className={classes.root} title="Quản lý cây">
      <AuthGuard roles={['Nông dân']} />
      <TreeHeader onAddEvent={handleEventNew} />
      <SearchBar onFilter={handleFilter} onSearch={handleSearch} />

      {treesStore && (
        <Results
          onCopy={handleClickCopy}
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
          plantTypeName={plantTypeName}
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
        onClose={handleCloseCopy}
        open={openCopy}>
        <GoblaLoadingChildren />
        <DialogTitle id="alert-dialog-title">Sao chép cây</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.field}
            error={hasError('copyNum')}
            fullWidth
            helperText={
              hasError('copyNum') ? formState.errors.copyNum[0] : null
            }
            label="Số cây được sao chép"
            type="number"
            name="copyNum"
            onChange={handleChange}
            value={formState.values.copyNum || ''}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleCloseCopy}>
            Đóng
          </Button>
          <Button
            color="primary"
            size="small"
            onClick={handleCopy}
            variant="contained"
            disabled={!formState.isValid}>
            Sao chép
          </Button>
        </DialogActions>
      </Dialog>
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
