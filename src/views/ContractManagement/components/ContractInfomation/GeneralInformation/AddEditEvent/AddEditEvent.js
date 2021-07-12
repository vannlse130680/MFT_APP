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
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
const schema = {
  reason: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 200,
      message: 'Tối đa chỉ 200 kí tự '
    }
  },

  refund: {
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
    onCancelContract,
    onAdd,
    onEdit,
    className,
    selectedContract,
    ...rest
  } = props;

  const classes = useStyles();

  const dispatch = useDispatch();

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
    if (selectedContract)
      setFormState(formState => ({
        ...formState,
        values: {
          refund: parseInt(
            selectedContract.contractPrice +
              selectedContract.contractPrice * (10 / 100)
          ),
          reason: selectedContract.reason
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
    if (event.target.name !== 'refund') {
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

  const handleDelete = () => {
    onDelete && onDelete(event);
  };

  const handleEdit = () => {
    console.log(formState.values);
    dispatch(showLoadingChildren());
    // var username = JSON.parse(sessionStorage.getItem('USER')).username;
    // // console.log(formState.values);
    var data = {
      contractID: selectedContract.contractID,
      cancelParty: selectedContract.farmerUsername,
      cancelReason: formState.values.reason,

      refund: parseInt(formState.values.refund)
    };

    // console.log(data);
    onCancelContract(data);
  };
  // console.log(selectedPlantType);
  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <GoblaLoadingChildren />
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm loại cây' : 'Hủy hợp đồng'}
          </Typography>

          <TextField
            className={classes.field}
            error={hasError('refund')}
            fullWidth
            helperText={hasError('refund') ? formState.errors.refund[0] : null}
            label="Tiền hoàn trả"
            name="refund"
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
            onChange={handleChange}
            value={formState.values.refund || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            error={hasError('reason')}
            fullWidth
            helperText={hasError('reason') ? formState.errors.reason[0] : null}
            label="Nguyên nhân"
            name="reason"
            onChange={handleChange}
            value={formState.values.reason || ''}
            variant="outlined"
          />
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
              variant="contained">
              Tạo
            </Button>
          ) : (
            <Button
              className={classes.confirmButton}
              disabled={!formState.isValid}
              onClick={handleEdit}
              variant="contained">
              Xác nhận
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
