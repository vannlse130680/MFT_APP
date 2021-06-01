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
import callAPI from 'utils/callAPI';
import { values } from 'lodash';
const schema = {
  name: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  supplier: {
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
  const [treeTypes, setTreeTypes] = useState([]);
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
    console.log(event.target.name);
    if (event.target.name === "test") {
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
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [event.target.name]:
            event.target.type === 'checkbox'
              ? event.target.checked
              : event.target.value
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
    var username = JSON.parse(localStorage.getItem('USER')).username;
    var data = {
      treeTypeID: values.auto.id,
      name: values.name,
      farmerUsername: username,
      supplier: values.supplier,
      crops: parseInt(values.crops),
      yield: parseFloat(values.yield),
      price: parseFloat(values.price)
    };

    console.log(formState);
    onAdd(data);
  };

  const handleEdit = () => {
    // if (!values.title || !values.desc) {
    //   return;
    // }

    // onEdit(values);
    onEdit();
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm loại cây' : 'Cập nhật loại cây'}
          </Typography>
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
            fullWidth
            label="Năng suất bình quân (kg/vụ)"
            name="yield"
            onChange={handleChange}
            value={formState.values.yield || ''}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            fullWidth
            label="Số vụ"
            name="crops"
            onChange={handleChange}
            value={formState.values.crops || ''}
            variant="outlined"
            type="number"
          />
          <TextField
            className={classes.field}
            fullWidth
            label="Giá"
            name="price"
            onChange={handleChange}
            value={formState.values.price || ''}
            variant="outlined"
            type="number"
          />
          <Autocomplete
            // onChange={handleChange}

            fullWidth
            // value={formState.values.test}
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
                value={formState.values.test}
                variant="outlined"
              />
            )}
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
              onClick={handleAdd}
              disabled={!formState.isValid}
              variant="contained">
              Tạo
            </Button>
          ) : (
            <Button
              className={classes.confirmButton}
              onClick={handleEdit}
              disabled={!formState.isValid}
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
