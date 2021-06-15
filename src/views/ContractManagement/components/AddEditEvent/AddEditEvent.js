/* eslint-disable react/display-name */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  colors,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { showLoadingChildren } from 'actions/childrenLoading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch } from 'react-redux';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import validate from 'validate.js';
const schema = {
  treePrice: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    numericality: {
      onlyInteger: true,

      greaterThan: 0,
      lessThanOrEqualTo: 100000000,
      message: 'Giá phải lớn 0 và bé hơn 100000000 và là số nguyên'
    }
  },
  shipFee: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    numericality: {
      onlyInteger: true,

      greaterThan: -1,
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
    selectedContract,
    ...rest
  } = props;

  const classes = useStyles();

  // const defaultValue = {
  //   name: '111',
  //   address: '111',
  //   plantType: '11'
  // };
  const [plantTypesName, setPlantTypesName] = useState([]);
  const [formState, setFormState] = useState({
    isValid: false,
    values: { status: 1 },
    touched: {},
    errors: {}
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const errors = validate(formState.values, schema, { fullMessages: false });

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  useEffect(() => {
    var username = JSON.parse(localStorage.getItem('USER')).username;
    callAPI(`PlantType/getPlantTypeName/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setPlantTypesName(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectedContract)
      setFormState(formState => ({
        ...formState,
        values: {
          treePrice: selectedContract.treePrice,
          shipFee: selectedContract.shipFee
        }
      }));
  }, []);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const mode = event ? 'edit' : 'add';

  const handleChange = (event, value) => {
    

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

  const handleDelete = () => {
    onDelete && onDelete(event);
  };

  const handleAdd = () => {
    dispatch(showLoadingChildren());
    var { values } = formState;
    var username = JSON.parse(localStorage.getItem('USER')).username;
    var data = {
      gardenCode: values.code,
      farmerUsername: username,
      gardenName: values.name,
      address: values.address,
      plantTypeID: values.auto.id
    };

    console.log(formState);
    onAdd(data);
  };

  const handleEdit = () => {
    
    dispatch(showLoadingChildren());
    
    var data = {
      contractID: selectedContract.id,
      treePrice:  parseInt(formState.values.treePrice),
      shipFee:  parseInt(formState.values.shipFee),
      totalPrice:
        parseInt(formState.values.treePrice) *
          parseInt(selectedContract.numOfYear) +
        parseInt(formState.values.shipFee)
    };
    console.log(data)
    onEdit(data);
  };
  // console.log(selectedPlantType);
  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <GoblaLoadingChildren/>
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm vườn' : 'Cập nhật hợp đồng'}
          </Typography>

          <TextField
            className={classes.field}
            error={hasError('treePrice')}
            fullWidth
            helperText={
              hasError('treePrice') ? formState.errors.treePrice[0] : null
            }
            label="Giá cây"
            name="treePrice"
            onChange={handleChange}
            value={formState.values.treePrice || ''}
            variant="outlined"
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />

          <TextField
            className={classes.field}
            error={hasError('shipFee')}
            fullWidth
            helperText={
              hasError('shipFee') ? formState.errors.shipFee[0] : null
            }
            label="Giá vận chuyển"
            name="shipFee"
            onChange={handleChange}
            value={formState.values.shipFee || 0}
            variant="outlined"
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
          <TextField
            className={classes.field}
            label="Tổng tiền"
            fullWidth
            InputProps={{
              readOnly: true,
              inputComponent: NumberFormatCustom
            }}
            value={
              parseInt(formState.values.treePrice) *
                parseInt(selectedContract.numOfYear) +
                parseInt(formState.values.shipFee) || ''
            }
            variant="outlined"
          />

          {/* {selectedGarden ? (
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
          ) : null} */}
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
