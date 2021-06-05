/* eslint-disable react/display-name */
import React, { useState, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid/v1';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  colors,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableCell,
  TableRow,
  TableBody,
  Table,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { Autocomplete } from '@material-ui/lab';
import validate from 'validate.js';
import callAPI from 'utils/callAPI';
import { values } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading } from 'actions/loading';
const schema = {
  code: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  price: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
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
  }
}));

const AddEditEvent = forwardRef((props, ref) => {
  const {
    event,
    onDelete,
    onCancel,
    onAdd,
    onEdit,
    className,
    selectedTree,
    ...rest
  } = props;
  const gardenInfor = useSelector(state => state.gardenInfor);
  const classes = useStyles();

  // const defaultValue = {
  //   name: '111',
  //   address: '111',
  //   plantType: '11'
  // };
  // const [plantTypesName, setPlantTypesName] = useState([]);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      status: 1,
      price: gardenInfor.pt.price,
      gardenId: gardenInfor.id
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

  // useEffect(() => {
  //   var username = JSON.parse(localStorage.getItem('USER')).username;
  //   callAPI(`PlantType/getPlantTypeName/${username}`, 'GET', null)
  //     .then(res => {
  //       if (res.status === 200) {
  //         setPlantTypesName(res.data);
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    if (selectedTree)
      setFormState(formState => ({
        ...formState,
        values: {
          code: selectedTree.treeCode,
          desc: selectedTree.description,
          price: selectedTree.price,

          image: selectedTree.image,

          status: selectedTree.status
        }
      }));
  }, []);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  // const [values, setValues] = useState(event || defaultEvent);

  const mode = event ? 'edit' : 'add';

  // const handleFieldChange = e => {
  //   e.persist();
  //   setValues(values => ({
  //     ...values,
  //     [e.target.name]:
  //       e.target.type === 'checkbox' ? e.target.checked : e.target.value
  //   }));
  // };

  const handleChange = (event, value) => {
    if (!event) return;
    event.persist();

    if (event.target.name === 'test') {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          test: ''
        },
        touched: {
          ...formState.touched,
          [event.target.name]: true
        }
      }));
    } else if (event.target.name) {
      console.log('status');
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
    } else {
      // console.log('auto');
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          auto: value,
          test: 'ád'
        }
      }));
    }
  };

  const handleDelete = () => {
    onDelete && onDelete(event);
  };

  const handleAdd = () => {
    // if (!values.title || !values.desc) {
    //   return;
    // }
    var { values } = formState;
    // var username = JSON.parse(localStorage.getItem('USER')).username;
    var data = {
      treeCode: values.code,
      gardenId: values.gardenId,
      price: values.price,
      image: values.image,
      description: values.desc
    };

    console.log(formState.values);
    onAdd(data);
  };
  const dispatch = useDispatch();
  const handleEdit = () => {
    // var username = JSON.parse(localStorage.getItem('USER')).username;
    console.log(formState.values);
    console.log(selectedTree);
    var data = {
      id: selectedTree.id,
      treeCode: formState.values.code,
      gardenDetailID: selectedTree.gardenDetailID,
      price: parseInt(formState.values.price),

      addDate: selectedTree.addDate,
      image: formState.values.image,
      description: formState.values.desc,
      status: formState.values.status
    };
    // console.log(data)
    onEdit(data);
  };
  function encodeImageFileAsURL() {
    var filesSelected = document.getElementById('inputFileToLoad').files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];

      var fileReader = new FileReader();

      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64

        // var newImage = document.createElement('img');
        // newImage.src = srcData;
        var image = document.getElementById('treeImg');
        image.src = srcData;
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            image: srcData
          }
        }));
        // newImage.style.cssText = 'width:200px;height:200px;';

        // document.getElementById('imgTest').innerHTML = newImage.outerHTML;
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  }

  // console.log(selectedPlantType);
  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm cây' : 'Cập nhật cây'}
          </Typography>
          {/* <Backdrop
            className={classes.backdrop}
            open={true}
            >
            <CircularProgress color="inherit" />
          </Backdrop> */}
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
            error={hasError('price')}
            fullWidth
            helperText={hasError('price') ? formState.errors.price[0] : null}
            label="Gía (mặc định là giá của loại cây)"
            name="price"
            type="number"
            onChange={handleChange}
            value={formState.values.price || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            fullWidth
            label="Mô tả"
            name="desc"
            onChange={handleChange}
            value={formState.values.desc || ''}
            variant="outlined"
          />

          {/* <img id="haha" src="" /> */}
          <Table>
            <TableBody>
              <TableRow>
                <TableCell style={{ borderBottom: 'none' }}>
                  Tải ảnh lên
                  <div>
                    {' '}
                    <input
                      id="inputFileToLoad"
                      type="file"
                      accept="image/*"
                      onChange={encodeImageFileAsURL}
                    />
                  </div>
                  Xóa
                </TableCell>

                <TableCell align="right" style={{ borderBottom: 'none' }}>
                  <div>
                    <img
                      id="treeImg"
                      src={formState.values.image}
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
          {/* <IconButton edge="start" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton> */}
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
