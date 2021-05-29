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
  colors
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { Autocomplete } from '@material-ui/lab';
import validate from 'validate.js';
const schema = {
  name: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  address: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  test: {
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
    ...rest
  } = props;

  const classes = useStyles();

  // const defaultValue = {
  //   name: '111',
  //   address: '111',
  //   plantType: '11'
  // };
  const [formState, setFormState] = useState({
    isValid: false,
    values: { name: '111', address: '111', plantType: '11' },
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
    event.persist();
    console.log(value);
    if (event.target.name) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [event.target.name]:
            event.target.type === 'checkbox'
              ? event.target.checked
              : event.target.value,
              test: ""
        },
        touched: {
          ...formState.touched,
          [event.target.name]: true
        }
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          auto: value,
          test: "ádasd"
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

    // onAdd({ ...values, id: uuid() });
    console.log(formState);
    onAdd();
  };

  const handleEdit = () => {
    // if (!values.title || !values.desc) {
    //   return;
    // }

    // onEdit(values);
    onEdit();
  };
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 }
  ];
  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm vườn' : 'Cập nhật vườn'}
          </Typography>
          <TextField
            className={classes.field}
            fullWidth
            error={hasError('name')}
            helperText={hasError('name') ? formState.errors.name[0] : null}
            label="Tên vườn"
            name="name"
            onChange={handleChange}
            value={formState.values.name}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            fullWidth
            error={hasError('address')}
            helperText={
              hasError('address') ? formState.errors.address[0] : null
            }
            label="Địa chỉ"
            name="address"
            onChange={handleChange}
            value={formState.values.address}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            fullWidth
            label="Loại cây "
            name="plantType"
            onChange={handleChange}
            value={formState.values.plantType}
            variant="outlined"
          />
          <Autocomplete
            // onChange={handleChange}

            name="test"
            // value={formState.values.test}
            // inputValue={formState.values.test}
            onInputChange={handleChange}
            // value={formState.values.test}
            id="combo-box-demo"
            options={top100Films}
            getOptionLabel={option => option.title}
            getOptionSelected={(option, value) => option.year === value.year}
            onChange={(event, value) => handleChange(event, value)} // prints the selected value
            fullWidth
            renderInput={params => (
              <TextField
                {...params}
                name="test"
                error={hasError('test')}
                helperText={
                  hasError('test') ? formState.errors.test[0] : null
                }
                value={formState.values.test}
                className={classes.field}
                label="Combo box"
                variant="outlined"
              />
            )}
          />

          {/* <FormControlLabel
            className={classes.field}
            control={
              <Switch
                checked={formState.values.allDay}
                name="allDay"
                onChange={handleChange}
              />
            }
            label="All day"
          /> */}
          {/* <TextField
            className={classes.field}
            defaultValue={moment(values.start).format('YYYY-MM-DDThh:mm:ss')}
            fullWidth
            label="Start date"
            name="start"
            onChange={handleChange}
            type="datetime-local"
            variant="outlined"
          />
          <TextField
            className={classes.field}
            defaultValue={moment(values.end).format('YYYY-MM-DDThh:mm:ss')}
            disabled={values.allDay}
            fullWidth
            label="End date"
            name="end"
            onChange={handleChange}
            type="datetime-local"
            variant="outlined"
          /> */}
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
              onClick={handleAdd}
              variant="contained">
              Tạo
            </Button>
          ) : (
            <Button
              className={classes.confirmButton}
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
