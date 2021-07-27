import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Button,
  Divider,
  TextField,
  colors
} from '@material-ui/core';
import validate from 'validate.js';
import callAPI from 'utils/callAPI';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from 'actions/loading';
import { toastError, toastSuccess } from 'utils/toastHelper';

const schema = {
  newPassword: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 16,
      minimum: 4,
      message: 'Tối đa chỉ 16 kí tự và tối thiểu 4 ký tự'
    }
  },
  confirmNewPassword: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 16,
      minimum: 4,
      message: 'Tối đa chỉ 16 kí tự và tối thiểu 4 ký tự'
    },
    equality: {
      attribute: 'newPassword',
      message: 'Mật khẩu nhập lại không trùng khớp'
    }
  },
  oldPassword: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 16,
      minimum: 4,
      message: 'Tối đa chỉ 16 kí tự và tối thiểu 4 ký tự'
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  passwordField: {
    width: 500
  }
}));

const Security = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
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
  // const [values, setValues] = useState({
  //   password: '',
  //   confirm: ''
  // });

  // const handleChange = event => {
  //   setValues({
  //     ...values,
  //     [event.target.name]: event.target.value
  //   });
  // };

  // const valid = values.password && values.password === values.confirm;
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
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleSave = () => {
    dispatch(showLoading());
    
    var username = JSON.parse(sessionStorage.getItem('USER')) ? JSON.parse(sessionStorage.getItem('USER')).username : null;
    var data = {
      username: username,
      oldPassword: formState.values.oldPassword,
      newPassword: formState.values.newPassword
    };
    callAPI('Account/changePassword', 'PUT', data).then(res => {
      if (res.data) {
        dispatch(hideLoading());
        toastSuccess('Cập nhật thành công!');
        setFormState({ isValid: false, values: {}, touched: {}, errors: {} });
      } else {
        dispatch(hideLoading());
        toastError('Mật khẩu hiện tại không chính xác !');
      }
    });
  };
  const handleReset = () => {
    setFormState({ isValid: false, values: {}, touched: {}, errors: {} });
  };
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Đổi mật khẩu" />
      <Divider />
      <CardContent>
        <form>
          <Grid container spacing={3}>
            <Grid item md={12} sm={6} xs={12}>
              <TextField
                className={classes.passwordField}
                error={hasError('oldPassword')}
                helperText={
                  hasError('oldPassword')
                    ? formState.errors.oldPassword[0]
                    : null
                }
                label="Mật khẩu hiện tại"
                name="oldPassword"
                onChange={handleChange}
                type="password"
                value={formState.values.oldPassword || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} sm={6} xs={12}>
              <TextField
                className={classes.passwordField}
                error={hasError('newPassword')}
                helperText={
                  hasError('newPassword')
                    ? formState.errors.newPassword[0]
                    : null
                }
                label="Mật khẩu mới"
                name="newPassword"
                onChange={handleChange}
                type="password"
                value={formState.values.newPassword || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} sm={6} xs={12}>
              <TextField
                className={classes.passwordField}
                error={hasError('confirmNewPassword')}
                helperText={
                  hasError('confirmNewPassword')
                    ? formState.errors.confirmNewPassword[0]
                    : null
                }
                label="Xác nhận mật khẩu mới"
                name="confirmNewPassword"
                onChange={handleChange}
                type="password"
                value={formState.values.confirmNewPassword || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          onClick={handleReset}
          // className={classes.saveButton}
          // disabled={!formState.isValid}
          variant="contained">
          Đặt lại
        </Button>
        <Button
          onClick={handleSave}
          className={classes.saveButton}
          disabled={!formState.isValid}
          variant="contained">
          Lưu
        </Button>
      </CardActions>
    </Card>
  );
};

Security.propTypes = {
  className: PropTypes.string
};

export default Security;
