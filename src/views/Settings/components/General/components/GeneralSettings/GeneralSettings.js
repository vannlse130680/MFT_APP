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

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
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
  // username: {
  //   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
  //   length: {
  //     maximum: 50,
  //     message: 'Tối đa chỉ 50 kí tự'
  //   }
  // },
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

  const classes = useStyles();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [values, setValues] = useState({
  //   firstName: profile.firstName,
  //   lastName: profile.lastName,
  //   email: profile.email,
  //   phone: profile.phone,
  //   state: profile.state,
  //   country: profile.country,
  //   isPublic: profile.isPublic,
  //   canHire: profile.canHire
  // });

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      fullName: profile.fullname,
      gender: profile.gender,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      birthday: profile.dateOfBirth
    },
    touched: {},
    errors: {}
  });
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
  // const handleChange = event => {
  //   event.persist();

  //   setValues({
  //     ...values,
  //     [event.target.name]:
  //       event.target.type === 'checkbox'
  //         ? event.target.checked
  //         : event.target.value
  //   });
  // };
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
  };
  const handleSubmit = event => {
    event.preventDefault();
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleSave = () => {
    console.log('hahahaha');
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
                error={hasError('fullName')}
                helperText={
                  hasError('fullName') ? formState.errors.fullName[0] : null
                }
                fullWidth
                label="Họ và tên"
                name="fullName"
                onChange={handleChange}
                required
                value={formState.values.fullName || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                error={hasError('birthday')}
                helperText={
                  hasError('birthday') ? formState.errors.birthday[0] : null
                }
                onChange={handleChange}
                name="birthday"
                variant="outlined"
                value={
                  moment(formState.values.birthday).format('YYYY-MM-DD') || ''
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
              <TextField
                fullWidth
                label="Địa chỉ Email"
                error={hasError('email')}
                helperText={
                  hasError('email') ? formState.errors.email[0] : null
                }
                name="email"
                onChange={handleChange}
                required
                value={formState.values.email || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                onChange={handleChange}
                type="text"
                value={formState.values.phone || ""}
                variant="outlined"
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
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                onChange={handleChange}
                required
                value={formState.values.address || ""}
                variant="outlined"
              />
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
          <Button
            className={classes.saveButton}
            disabled={!formState.isValid}
            variant="contained"
            onClick={handleSave}>
            Save Changes
          </Button>
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
