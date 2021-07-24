/* eslint-disable react/display-name */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  colors,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/DeleteOutlineOutlined';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import { makeStyles } from '@material-ui/styles';
import { hideLoadingChildren, showLoadingChildren } from 'actions/childrenLoading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import validate from 'validate.js';
import firebase from '../../../../firebase/firebase';
import NumberFormat from 'react-number-format';
import { toastError } from 'utils/toastHelper';
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      isNumericString
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator={'.'}
      decimalSeparator={','}
    />
  );
}
const schema = {
  code: {
    format: {
      pattern: '[aA-zZ0-9]+',
      flags: 'i',
      message: 'Mã không được chứa kí tự đặc biệt'
    },
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 20,
      message: 'Tối đa chỉ 20 kí tự'
    }
  },
  price: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    numericality: {
      onlyInteger: true,

      greaterThan: 0,
      lessThanOrEqualTo: 100000000,
      message: 'Giá phải lớn 0 và bé hơn 100.000.000 và là số nguyên'
    }
  },
  desc: {
    length: { maximum: 500, message: 'Mô tả không được vượt quá 500 kí tự' }
  },
  standard: {
    length: { maximum: 50, message: 'Mô tả không được vượt quá 50 kí tự' }
  }
};
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  field: {
    marginTop: theme.spacing(3)
  },
  cancelButton: {
    marginLeft: 'auto'
  },
  confirmButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },

  circularProgress: {
    marginRight: 10
  }
}));
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
// eslint-disable-next-line react/no-multi-comp
const AddEditEvent = forwardRef((props, ref) => {
  const {
    event,
    onDelete,
    onCancel,
    onAdd,
    onEdit,
    className,
    selectedTree,
    plantTypeName,
    ...rest
  } = props;
  const gardenInfor = useSelector(state => state.gardenInfor);
  const classes = useStyles();
  const [imageState, setImageState] = useState({
    image: null,
    progress: 0,
    downloadURL: null
  });

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      status: 1,
      price: gardenInfor.pt.price,
      gardenId: gardenInfor.id,
      code: 'C' + removeVietnameseTones(plantTypeName
        .split(/\s/)
        .reduce(
          (response, word) =>
            (response += word.slice(0, 1)),
          ''
        )) + Math.floor(100000 + Math.random() * 900000)
    },
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

  useEffect(() => {
    if (selectedTree)
      setFormState(formState => ({
        ...formState,
        values: {
          code: selectedTree.treeCode,
          desc: selectedTree.description,
          price: selectedTree.price,
          standard: selectedTree.standard,
          image: selectedTree.image === '' ? null : selectedTree.image,

          status: selectedTree.status
        }
      }));
  }, []);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  // const [values, setValues] = useState(event || defaultEvent);

  const mode = event ? 'edit' : 'add';

  const handleChange = (event, value) => {
    if (!event) return;
    if (event.target.name !== 'price') {
      event.persist();
    }

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

  // const handleDelete = () => {
  //   onDelete && onDelete(event);
  // };

  const handleAdd = () => {
    dispatch(showLoadingChildren());
    let file = imageState.image;
    if (file) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child('folder/' + file.name).put(file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFormState(formState => ({
            ...formState,
            values: {
              ...formState.values,
              progress: progress
            }
          }));
        },
        error => {
          dispatch(hideLoadingChildren());
          toastError('Có lỗi xảy ra vui lòng thử lại');
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            var { values } = formState;
            var data = {
              treeCode: values.code,
              gardenId: values.gardenId,
              price: parseInt(values.price),
              image: url,
              description: values.desc,
              standard: values.standard
            };

            onAdd(data);
          });
          // document.getElementById('file').value = null;
        }
      );
    } else {
      var { values } = formState;
      var data = {
        treeCode: values.code,
        gardenId: values.gardenId,
        price: parseInt(values.price),
        image: null,
        description: values.desc,
        standard: values.standard
      };

      onAdd(data);
    }
    // console.log(formState);
    // // var username = JSON.parse(localStorage.getItem('USER')).username;
  };
  const dispatch = useDispatch();
  const handleEdit = () => {
    dispatch(showLoadingChildren());
    let file = imageState.image;
    if (file) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child('folder/' + file.name).put(file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFormState(formState => ({
            ...formState,
            values: {
              ...formState.values,
              progress: progress
            }
          }));
        },
        error => {
          dispatch(hideLoadingChildren());
          toastError('Có lỗi xảy ra vui lòng thử lại');
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            var data = {
              id: selectedTree.id,
              treeCode: formState.values.code,
              gardenDetailID: selectedTree.gardenDetailID,
              price: parseInt(formState.values.price),
              standard: formState.values.standard,
              addDate: selectedTree.addDate,
              image: url,
              description: formState.values.desc,
              status: formState.values.status
            };

            onEdit(data);
          });
          // document.getElementById('file').value = null;
        }
      );
    } else {
      var data = {
        id: selectedTree.id,
        treeCode: formState.values.code,
        gardenDetailID: selectedTree.gardenDetailID,
        price: parseInt(formState.values.price),
        standard: formState.values.standard,
        addDate: selectedTree.addDate,
        image: formState.values.image,
        description: formState.values.desc,
        status: formState.values.status
      };

      onEdit(data);
    }
  };

  const handleUpload = () => {
    // console.log(this.state.image);
  };
  const handleImageChange = e => {
    if (e.target.files[0]) {
      setImageState(imageState => ({
        ...imageState,
        image: e.target.files[0]
      }));

      var oFReader = new FileReader();
      oFReader.readAsDataURL(e.target.files[0]);
      oFReader.onload = function(oFREvent) {
        document.getElementById('treeImg').src = oFREvent.target.result;
      };
    }
    console.log(e.target.files[0]);
  };
  // console.log(selectedPlantType);
  const handleRemoveImage = () => {
    document.getElementById('inputFileToLoad').value = null;
    setImageState(imageState => ({
      ...imageState,
      image: null
    }));
    document.getElementById('treeImg').src = '/images/treeDefault.png';
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        image: null
      }
    }));
  };
  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <GoblaLoadingChildren />
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm cây' : 'Cập nhật cây'}
          </Typography>

          <TextField
            className={classes.field}
            error={hasError('code')}
            fullWidth
            helperText={hasError('code') ? formState.errors.code[0] : null}
            label="Mã"
            name="code"
            onChange={handleChange}
            value={formState.values.code || ''}
            variant="outlined"
          />

          <TextField
            className={classes.field}
            fullWidth
            error={hasError('price')}
            helperText={hasError('price') ? formState.errors.price[0] : null}
            label="Giá (mặc định là giá của loại cây)"
            name="price"
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
            onChange={handleChange}
            value={formState.values.price || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            fullWidth
            multiline
            error={hasError('desc')}
            helperText={hasError('desc') ? formState.errors.desc[0] : null}
            label="Mô tả"
            name="desc"
            onChange={handleChange}
            value={formState.values.desc || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            fullWidth
            error={hasError('standard')}
            helperText={
              hasError('standard') ? formState.errors.standard[0] : null
            }
            label="Tiêu chuẩn"
            name="standard"
            onChange={handleChange}
            value={formState.values.standard || ''}
            variant="outlined"
          />

          {/* <img id="haha" src="" /> */}
          <Table>
            <TableBody>
              <TableRow>
                <TableCell style={{ borderBottom: 'none' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    className={classes.attachImageButton}>
                    <AddPhotoIcon />
                    Tải ảnh lên
                    <input
                      id="inputFileToLoad"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </Button>{' '}
                  <Button
                    onClick={handleRemoveImage}
                    variant="outlined"
                    component="label"
                    className={classes.removeImageButton}>
                    <RemoveIcon />
                    Gỡ
                  </Button>{' '}
                </TableCell>

                <TableCell align="right" style={{ borderBottom: 'none' }}>
                  <div>
                    <img
                      id="treeImg"
                      src={
                        formState.values.image && formState.values.image !== ''
                          ? formState.values.image
                          : '/images/treeDefault.png'
                      }
                      style={{ width: 200, height: 300 }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {selectedTree ? (
            <FormControl className={classes.field} variant="outlined" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">
                Trạng thái
              </InputLabel>
              <Select
                id="demo-simple-select-outlined"
                label="Trạng thái"
                labelId="demo-simple-select-outlined-label"
                name="status"
                onChange={handleChange}
                value={formState.values.status}>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={0}>Tạm ngừng</MenuItem>
              </Select>
            </FormControl>
          ) : null}
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.cancelButton}
            onClick={onCancel}
            variant="contained">
            Hủy bỏ
          </Button>
          {mode === 'add' ? (
            <Button
              className={classes.confirmButton}
              disabled={!formState.isValid}
              onClick={handleAdd}
              variant="contained">
              Tạo
            </Button>
          ) : (
            <Button
              className={classes.confirmButton}
              disabled={!formState.isValid}
              onClick={handleEdit}
              variant="contained">
              Lưu
            </Button>
          )}
        </CardActions>
      </form>
    </Card>
  );
});

AddEditEvent.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object,
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default AddEditEvent;
