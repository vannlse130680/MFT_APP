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
import { useDispatch } from 'react-redux';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import validate from 'validate.js';
const schema = {
  fullName: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 100,
      message: 'Tối đa chỉ 100 kí tự '
    }
  },
  username: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 50,
      message: 'Tối đa chỉ 50 kí tự'
    }
  },
  address: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 100,
      message: 'Tối đa chỉ 100 kí tự '
    }
  },
  email: {
    presence: { allowEmpty: true, message: 'Không thể bỏ trống' },
    email: {
      message: 'Email không hợp lệ'
    },
    length: {
      maximum: 64
    }
  },
  // birthday: {
  //   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
  //   datetime: {
  //     dateOnly: true,
  //     latest: moment.utc().subtract(18, 'years'),
  //     message: 'Bạn cần đủ 18 tuổi'
  //   }
  // },
  phoneNum: {
    format: {
      pattern: /((09|03|07|08|05)+([0-9]{8})\b)/,

      message: 'Số điện thoại không hợp lệ'
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 50,
      message: 'Tối đa chỉ 50 kí tự'
    }
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 50,
      message: 'Tối đa chỉ 50 kí tự'
    },
    equality: {
      attribute: 'password',
      message: 'Mật khẩu nhập lại không trùng khớp'
    }
  }
  // policy: {
  //   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
  //   checked: true
  // }
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
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
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

  // useEffect(() => {
  //   if (selectedGarden)
  //     setFormState(formState => ({
  //       ...formState,
  //       values: {
  //         name: selectedGarden.gardenName,
  //         address: selectedGarden.address,
  //         code: selectedGarden.gardenCode,

  //         test: 'a',
  //         auto: selectedGarden.plantTypeObj,
  //         status: selectedGarden.status
  //       }
  //     }));
  // }, []);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const mode = event ? 'edit' : 'add';

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
    console.log(formState.values)
    // dispatch(showLoadingChildren());
    // var { values } = formState;
    // var username = JSON.parse(localStorage.getItem('USER')).username;
    // var data = {
    //   gardenCode: values.code,
    //   farmerUsername: username,
    //   gardenName: values.name,
    //   address: values.address,
    //   plantTypeID: values.auto.id
    // };

    // console.log(formState);
    // onAdd(data);
  };

  // const handleEdit = () => {
  //   dispatch(showLoadingChildren());
  //   var username = JSON.parse(localStorage.getItem('USER')).username;
  //   // console.log(formState.values);
  //   // console.log(selectedGarden)
  //   var data = {
  //     gardenId: selectedGarden.id,
  //     gardenCode: formState.values.code,
  //     farmerUsername: username,
  //     gardenName: formState.values.name,
  //     address: formState.values.address,
  //     gardenDetailId: selectedGarden.gardenDetailId,
  //     plantTypeID: formState.values.auto.id,
  //     status: formState.values.status
  //   };
  //   // console.log(data)
  //   onEdit(data);
  // };
  // console.log(selectedPlantType);
  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <GoblaLoadingChildren />
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Tạo tài khoản' : 'Cập nhật vườn'}
          </Typography>

          <div className={classes.fields}>
            <TextField
              error={hasError('fullName')}
              helperText={
                hasError('fullName') ? formState.errors.fullName[0] : null
              }
              fullWidth
              label="Công ty vận chuyển"
              name="fullName"
              onChange={handleChange}
              value={formState.values.fullName || ''}
              variant="outlined"
            />
            {/* <TextField
              error={hasError('birthday')}
              helperText={
                hasError('birthday') ? formState.errors.birthday[0] : null
              }
              onChange={handleChange}
              name="birthday"
              variant="outlined"
              value={formState.values.birthday || ''}
              label="Ngày sinh *"
              type="date"
              // defaultValue="1999-06-03"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Giới tính
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="gender"
                value={formState.values.gender}
                onChange={handleChange}
                label="Giới tính">
                <MenuItem value={1}>Nam</MenuItem>
                <MenuItem value={0}>Nữ</MenuItem>
              </Select>
            </FormControl> */}
            <TextField
              error={hasError('email')}
              fullWidth
              helperText={hasError('email') ? formState.errors.email[0] : null}
              label="Địa chỉ email"
              name="email"
              onChange={handleChange}
              value={formState.values.email || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('phoneNum')}
              fullWidth
              helperText={
                hasError('phoneNum') ? formState.errors.phoneNum[0] : null
              }
              label="Số điện thoại *"
              name="phoneNum"
              onChange={handleChange}
              value={formState.values.phoneNum || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('address')}
              fullWidth
              helperText={
                hasError('address') ? formState.errors.address[0] : null
              }
              label="Địa chỉ *"
              name="address"
              onChange={handleChange}
              value={formState.values.address || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('username')}
              fullWidth
              helperText={
                hasError('username') ? formState.errors.username[0] : null
              }
              label="Tên tài khoản *"
              name="username"
              onChange={handleChange}
              value={formState.values.username || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              label="Mật khẩu *"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('confirmPassword')}
              fullWidth
              helperText={
                hasError('confirmPassword')
                  ? formState.errors.confirmPassword[0]
                  : null
              }
              label="Xác nhận mật khẩu *"
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              value={formState.values.confirmPassword || ''}
              variant="outlined"
            />
            {/* <div>
          <div className={classes.policy}>
            <Checkbox
              checked={formState.values.policy || false}
              className={classes.policyCheckbox}
              color="primary"
              name="policy"
              onChange={handleChange}
            />
            <Typography color="textSecondary" variant="body1">
              Tôi đã đọc{' '}
              <Link
                color="secondary"
                component={RouterLink}
                to="#"
                underline="always"
                variant="h6">
                chính sách và điều khoản
              </Link>
            </Typography>
          </div>
          {hasError('policy') && (
            <FormHelperText error>{formState.errors.policy[0]}</FormHelperText>
          )}
        </div> */}
          </div>
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
