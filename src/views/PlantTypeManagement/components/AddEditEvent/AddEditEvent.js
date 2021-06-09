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
  MenuItem
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { Autocomplete } from '@material-ui/lab';
import validate from 'validate.js';
import callAPI from 'utils/callAPI';
import { values } from 'lodash';
import { useDispatch } from 'react-redux';
import { showLoadingChildren } from 'actions/childrenLoading';
import NumberFormat from 'react-number-format';
const schema = {
  name: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 100,
      message: 'Tối đa chỉ 100 kí tự '
    }
  },
  supplier: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 200,
      message: 'Tối đa chỉ 200 kí tự '
    }
  },
  test: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  yield: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    numericality: {
      greaterThan: 0,
      lessThanOrEqualTo: 1000,
      message: 'Năng suất phải lớn 0 và bé hơn 10000kg'
    }
  },
  crops: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      lessThanOrEqualTo: 100,
      message: 'Số vụ phải lớn 0 và bé hơn 100 và là số nguyên'
    }
  },
  price: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    numericality: {
      onlyInteger: true,

      greaterThan: 0,
      lessThanOrEqualTo: 100000000,
      message: 'Giá phải lớn 0 và bé hơn 100000000 và là số nguyên'
    }
  }
};
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

// eslint-disable-next-line react/no-multi-comp
const AddEditEvent = forwardRef((props, ref) => {
  const {
    event,
    onDelete,
    onCancel,
    onAdd,
    onEdit,
    className,
    selectedPlantType,
    ...rest
  } = props;

  const classes = useStyles();

  const dispatch = useDispatch();
  const [treeTypes, setTreeTypes] = useState([]);
  const [formState, setFormState] = useState({
    isValid: false,
    values: { status: 1 },
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
    callAPI('treetype', 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setTreeTypes(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectedPlantType)
      setFormState(formState => ({
        ...formState,
        values: {
          name: selectedPlantType.plantTypeName,
          supplier: selectedPlantType.supplier,
          yield: selectedPlantType.yield,
          crops: selectedPlantType.crops,
          price: selectedPlantType.price,
          test: 'a',
          auto: selectedPlantType.t,
          status: selectedPlantType.status
        }
      }));
  }, []);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  // const [values, setValues] = useState(event || defaultEvent);

  const mode = event ? 'edit' : 'add';

  const handleChange = (event, value) => {
    if (!event) return;
    /// changehere
    if (event.target.name !== 'price') {
      event.persist();
    }

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
    dispatch(showLoadingChildren());
    var { values } = formState;
    var username = JSON.parse(localStorage.getItem('USER')).username;
    var data = {
      treeTypeID: values.auto.id,
      name: values.name,
      farmerUsername: username,
      supplier: values.supplier,
      crops: parseInt(values.crops),
      yield: parseFloat(values.yield),
      price: parseInt(values.price)
    };

    console.log(formState);
    onAdd(data);
  };

  const handleEdit = () => {
    dispatch(showLoadingChildren());
    var username = JSON.parse(localStorage.getItem('USER')).username;
    // console.log(formState.values);
    var data = {
      id: selectedPlantType.id,
      treeTypeID: formState.values.auto.id,
      plantTypeName: formState.values.name,
      farmerUsername: username,
      supplier: formState.values.supplier,
      crops: parseInt(formState.values.crops),
      yield: parseFloat(formState.values.yield),
      price: parseInt(formState.values.price),
      status: formState.values.status
    };
    // console.log(data)
    onEdit(data);
  };
  // console.log(selectedPlantType);
  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm loại cây' : 'Cập nhật loại cây'}
          </Typography>
          <Autocomplete
            // onChange={handleChange}
            // value={selectedPlantType.t}
            defaultValue={selectedPlantType ? selectedPlantType.t : null}
            fullWidth
            // inputValue={formState.values.test}
            getOptionLabel={option => option.typeName}
            // value={formState.values.test}
            getOptionSelected={(option, value) => option.id === value.id}
            onChange={(event, value) => handleChange(event, value)}
            onInputChange={handleChange} // prints the selected value
            options={treeTypes}
            renderInput={params => (
              <TextField
                {...params}
                className={classes.field}
                error={hasError('test')}
                helperText={hasError('test') ? formState.errors.test[0] : null}
                label="Loại trái cây"
                name="test"
                value={formState.values.test || ''}
                variant="outlined"
              />
            )}
          />
          <TextField
            className={classes.field}
            error={hasError('name')}
            fullWidth
            helperText={hasError('name') ? formState.errors.name[0] : null}
            label="Tên"
            name="name"
            onChange={handleChange}
            value={formState.values.name || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            error={hasError('supplier')}
            fullWidth
            helperText={
              hasError('supplier') ? formState.errors.supplier[0] : null
            }
            label="Nhà cung cấp"
            name="supplier"
            onChange={handleChange}
            value={formState.values.supplier || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            error={hasError('yield')}
            fullWidth
            fullWidth
            helperText={hasError('yield') ? formState.errors.yield[0] : null}
            label="Năng suất bình quân (kg/vụ)"
            name="yield"
            onChange={handleChange}
            type="number"
            value={formState.values.yield || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            error={hasError('crops')}
            fullWidth
            fullWidth
            helperText={hasError('crops') ? formState.errors.crops[0] : null}
            label="Số vụ"
            name="crops"
            onChange={handleChange}
            type="number"
            value={formState.values.crops || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            error={hasError('price')}
            fullWidth
            fullWidth
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
            helperText={hasError('price') ? formState.errors.price[0] : null}
            label="Giá"
            name="price"
            onChange={handleChange}
            // type="number"
            value={formState.values.price || ''}
            variant="outlined"
          />

          {selectedPlantType ? (
            <FormControl className={classes.field} fullWidth variant="outlined">
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
