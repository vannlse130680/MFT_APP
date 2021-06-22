import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  Switch,
  TextField,
  Typography,
  colors
} from '@material-ui/core';

import SuccessSnackbar from '../SuccessSnackbar';
import validate from 'validate.js';
import moment from 'moment';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Select } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import callAPI from 'utils/callAPI';
import { hideLoading, showLoading } from 'actions/loading';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from 'utils/toastHelper';
import { actUpdateUserInfor } from 'actions/userInformation';

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    marginLeft: 10,
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  formControl: {
    minWidth: 150
  }
}));
validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse: function(value, options) {
    return +moment.utc(value);
  },
  // Input is a unix timestamp
  format: function(value, options) {
    var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  }
});
const schema = {
  fullName: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 100,
      message: 'Tối đa chỉ 100 kí tự '
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
    email: {
      message: 'Email không hợp lệ'
    },
    length: {
      maximum: 50,
      message: 'Tố đa chỉ 50 kí tự'
    }
  },
  birthday: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    datetime: {
      dateOnly: true,
      latest: moment.utc().subtract(18, 'years'),
      message: 'Bạn cần đủ 18 tuổi'
    }
  },
  phone: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    format: {
      pattern: /((09|03|07|08|05)+([0-9]{8})\b)/,

      message: 'Số điện thoại không hợp lệ'
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
  // password: {
  //   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
  //   length: {
  //     maximum: 50,
  //     message: 'Tối đa chỉ 50 kí tự'
  //   }
  // },
  // confirmPassword: {
  //   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
  //   length: {
  //     maximum: 50,
  //     message: 'Tối đa chỉ 50 kí tự'
  //   },
  //   equality: {
  //     attribute: 'password',
  //     message: 'Mật khẩu nhập lại không trùng khớp'
  //   }
  // }
  // policy: {
  //   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
  //   checked: true
  // }
};

const GeneralSettings = props => {
  const { profile, className, ...rest } = props;
  // const profile = useSelector(state => state.userInfor);
  console.log(profile);
  const classes = useStyles();

  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(false);
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      fullName: profile.fullname,
      gender: profile.gender,
      email: profile.email && profile.email !== '' ? profile.email : null,
      phone: profile.phone,
      address: profile.address,
      birthday: profile.dateOfBirth,
      city: profile.city,
      district: profile.district,
      ward: profile.ward
    },
    touched: {},
    errors: {}
  });
  useEffect(() => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        fullName: profile.fullname,
        gender: profile.gender,
        email: profile.email && profile.email !== '' ? profile.email : null,
        phone: profile.phone,
        address: profile.address,
        birthday: profile.dateOfBirth,
        city: profile.city,
        district: profile.district,
        ward: profile.ward
      }
    }));
  }, [profile]);
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
  useEffect(() => {
    const errors = validate(formState.values, schema, {
      fullMessages: false
    });
    // console.log("")
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

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

  const handleClickUpdate = () => {
    setIsUpdate(true);
  };
  const handleSave = () => {
    dispatch(showLoading());
    console.log(formState.values);
    var data = {
      username: profile.username,
      password: profile.password,
      fullname: formState.values.fullName,
      gender: formState.values.gender,
      dateOfBirth: formState.values.birthday,
      address: formState.values.address,
      phone: formState.values.phone,
      email: formState.values.email,
      avatar: profile.avatar,
      city: formState.values.city,
      district: formState.values.district,
      ward: formState.values.ward
    };
    callAPI('Account/updateAccount', 'PUT', data)
      .then(res => {
        if (res.data === true) {
          dispatch(hideLoading());
          toastSuccess('Cập nhật thành công !');
          dispatch(actUpdateUserInfor(data));
          setIsUpdate(false);
        } else {
          dispatch(hideLoading());
          toastError('Cập nhật thất bại!');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleCancelClick = () => {
    setFormState({
      isValid: false,
      values: {
        fullName: profile.fullname,
        gender: profile.gender,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        birthday: profile.dateOfBirth,
        city: profile.city,
        district: profile.district,
        ward: profile.ward
      },
      touched: {},
      errors: {}
    });
    setIsUpdate(false);
  };
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form>
        <CardHeader title="Thông tin tài khoản" />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <TextField
                InputProps={{
                  readOnly: !isUpdate
                }}
                error={hasError('fullName')}
                helperText={
                  hasError('fullName') ? formState.errors.fullName[0] : null
                }
                fullWidth
                label="Họ và tên"
                name="fullName"
                onChange={handleChange}
                required
                value={formState.values.fullName || profile.fullname || ''}
                variant="outlined"
              />
            </Grid>
            {profile.role !== 'Shipper' ? (
              <Grid container item md={6} xs={12} spacing={1}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    InputProps={{
                      readOnly: !isUpdate
                    }}
                    error={hasError('birthday')}
                    helperText={
                      hasError('birthday') ? formState.errors.birthday[0] : null
                    }
                    onChange={handleChange}
                    name="birthday"
                    variant="outlined"
                    value={
                      moment(formState.values.birthday).format('YYYY-MM-DD') ||
                      ''
                    }
                    label="Ngày sinh *"
                    type="date"
                    // defaultValue="1999-06-03"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      Giới tính
                    </InputLabel>
                    <Select
                      inputProps={{ readOnly: !isUpdate }}
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      name="gender"
                      value={formState.values.gender}
                      onChange={handleChange}
                      label="Giới tính">
                      <MenuItem value={1}>Nam</MenuItem>
                      <MenuItem value={0}>Nữ</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            ) : null}

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                InputProps={{
                  readOnly: !isUpdate
                }}
                label="Địa chỉ Email"
                error={hasError('email')}
                helperText={
                  hasError('email') ? formState.errors.email[0] : null
                }
                name="email"
                onChange={handleChange}
                required
                value={formState.values.email || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={hasError('phone')}
                helperText={
                  hasError('phone') ? formState.errors.phone[0] : null
                }
                fullWidth
                InputProps={{
                  readOnly: !isUpdate
                }}
                label="Số điện thoại"
                name="phone"
                onChange={handleChange}
                type="text"
                value={formState.values.phone || ''}
                variant="outlined"
              />
            </Grid>

            <Grid container spacing={1} item md={12} xs={12}>
              <Grid item md={3} xs={12}>
                {' '}
                <FormControl
                  className={classes.formControl}
                  variant="outlined"
                  fullWidth>
                  <InputLabel>Tỉnh/Thành Phố</InputLabel>
                  <Select
                    inputProps={{ readOnly: !isUpdate }}
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
                    inputProps={{ readOnly: !isUpdate }}
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
                <FormControl
                  className={classes.formControl}
                  variant="outlined"
                  fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Xã/Thị trấn
                  </InputLabel>
                  <Select
                    inputProps={{ readOnly: !isUpdate }}
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
                  helperText={
                    hasError('address') ? formState.errors.address[0] : null
                  }
                  inputProps={{ readOnly: !isUpdate }}
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  onChange={handleChange}
                  required
                  value={formState.values.address || ''}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            {/* <Grid item md={6} xs={12}>
              <Typography variant="h6">Make Contact Info Public</Typography>
              <Typography variant="body2">
                Means that anyone viewing your profile will be able to see your
                contacts details
              </Typography>
              <Switch
                checked={formState.values.isPublic}
                color="secondary"
                edge="start"
                name="isPublic"
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography variant="h6">Available to hire</Typography>
              <Typography variant="body2">
                Toggling this will let your teamates know that you are available
                for acquireing new projects
              </Typography>
              <Switch
                checked={values.canHire}
                color="secondary"
                edge="start"
                name="canHire"
                onChange={handleChange}
              />
            </Grid> */}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          {isUpdate ? (
            <div>
              <Button variant="contained" onClick={handleCancelClick}>
                Hủy bỏ
              </Button>
              <Button
                className={classes.saveButton}
                disabled={!formState.isValid}
                variant="contained"
                onClick={handleSave}>
                Lưu
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickUpdate}>
              Sửa
            </Button>
          )}
        </CardActions>
      </form>
      {/* <SuccessSnackbar onClose={handleSnackbarClose} open={openSnackbar} /> */}
    </Card>
  );
};

GeneralSettings.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default GeneralSettings;
