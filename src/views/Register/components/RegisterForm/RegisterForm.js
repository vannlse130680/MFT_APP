import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  Typography,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';

import useRouter from 'utils/useRouter';
import callAPI from 'utils/callAPI';
import { toastError, toastSuccess } from 'utils/toastHelper';
import moment from 'moment';

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
      maximum: 32
    }
  },
  username: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 32
    }
  },
  address: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 32
    }
  },
  // email: {
  //   presence: { allowEmpty: true, message: 'Không thể bỏ trống' },
  //   email: {
  //     message: 'Email không hợp lệ'
  //   },
  //   length: {
  //     maximum: 64
  //   }
  // },
  birthday: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    datetime: {
      dateOnly: true,
      latest: moment.utc().subtract(18, 'years'),
      message: 'Bạn cần đủ 18 tuổi'
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
      maximum: 128
    }
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 128
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
  root: {},
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  policy: {
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  }
}));

const RegisterForm = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const { history } = useRouter();

  const [formState, setFormState] = useState({
    isValid: false,
    values: { gender: 1 },
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema, { fullMessages: false });
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
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: event.target.value === '' ? false : true
      }
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    console.log(formState.values);
    var data = {
      username: formState.values.username,
      password: formState.values.password,
      fullname: formState.values.fullName,
      gender: formState.values.gender,
      dateOfBirth: formState.values.birthday,
      email: '',
      phone: formState.values.phoneNum,
      address: formState.values.address,
      avatar: ''
    };
    console.log(data);
    callAPI('Account/register', 'POST', data)
      .then(response => {
        if (response.status === 200 && response.data) {
          toastSuccess('Đăng kí tài khoản thành công');
          history.push('/');
        } else {
          toastError('Tên tài khoản đã tồn tại !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <form
      {...rest}
      className={clsx(classes.root, className)}
      onSubmit={handleSubmit}>
      <div className={classes.fields}>
        <TextField
          error={hasError('fullName')}
          helperText={
            hasError('fullName') ? formState.errors.fullName[0] : null
          }
          fullWidth
          label="Họ và tên *"
          name="fullName"
          onChange={handleChange}
          value={formState.values.fullName || ''}
          variant="outlined"
        />
        <TextField
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
        </FormControl>

        {/* <TextField
          error={hasError('email')}
          fullWidth
          helperText={hasError('email') ? formState.errors.email[0] : null}
          label="Địa chỉ email"
          name="email"
          onChange={handleChange}
          value={formState.values.email || ''}
          variant="outlined"
        /> */}
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
          helperText={hasError('address') ? formState.errors.address[0] : null}
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
      <Button
        className={classes.submitButton}
        color="secondary"
        disabled={!formState.isValid}
        size="large"
        type="submit"
        variant="contained">
        Tạo tài khoản
      </Button>
    </form>
  );
};

RegisterForm.propTypes = {
  className: PropTypes.string
};

export default RegisterForm;
