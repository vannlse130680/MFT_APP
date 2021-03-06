/* eslint-disable react/display-name */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  colors,
  Divider,
  FormControl,
  Grid,
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
  },
  city: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  district: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  ward: {
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
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
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
    callAPI('city', 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setCitys(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
    callAPI('District', 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setDistricts(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
    callAPI('ward', 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setWards(res.data);
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

    if (event.target.name) {
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
    }
    if (event.target.name === 'city') {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          district: null,
          ward: null
        }
      }));
    }
    if (event.target.name === 'district') {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,

          ward: null
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

    var data = {
      username: values.username,
      password: values.password,
      fullname: values.fullName,
      address: values.address,
      phone: values.phoneNum,
      email: values.email,
      city: values.city,
      district: values.district,
      ward: values.ward
    };

    onAdd(data);
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
            <Grid container spacing={1}>
              <Grid item md={3} xs={12}>
                {' '}
                <FormControl
                  className={classes.formControl}
                  variant="outlined"
                  fullWidth>
                  <InputLabel>Tỉnh/Thành Phố</InputLabel>
                  <Select
                    error={hasError('city')}
                    name="city"
                    label="Tỉnh/Thành Phố"
                    onChange={handleChange}
                    value={formState.values.city || ''}>
                    {citys.map((pro, index) => (
                      <MenuItem key={index} value={pro.id}>
                        {pro.cityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12}>
                <FormControl
                  className={classes.formControl}
                  variant="outlined"
                  fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Quận/Huyện
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Quận/Huyện"
                    name="district"
                    value={formState.values.district || ''}
                    onChange={handleChange}>
                    {districts
                      .filter(dis => dis.cityID === formState.values.city)
                      .map((dis, index) => (
                        <MenuItem key={index} value={dis.id}>
                          {dis.districtName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12}>
                {' '}
                <FormControl
                  className={classes.formControl}
                  variant="outlined"
                  fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Xã/Thị trấn
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="ward"
                    label="Xã/Thị Trấn"
                    value={formState.values.ward || ''}
                    onChange={handleChange}>
                    {wards
                      .filter(
                        ward => ward.districtID === formState.values.district
                      )
                      .map((ward, index) => (
                        <MenuItem key={index} value={ward.id}>
                          {ward.wardName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  error={hasError('address')}
                  fullWidth
                  helperText={
                    hasError('address') ? formState.errors.address[0] : null
                  }
                  label="Số/Đường"
                  name="address"
                  onChange={handleChange}
                  value={formState.values.address || ''}
                  variant="outlined"
                />
              </Grid>
            </Grid>

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
