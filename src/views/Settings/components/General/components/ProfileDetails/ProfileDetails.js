import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import firebase from '../../../../../../firebase/firebase';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions
} from '@material-ui/core';
import callAPI from 'utils/callAPI';
import { toastError, toastSuccess } from 'utils/toastHelper';
import { useDispatch } from 'react-redux';
import { actUpdateUserAvatar } from 'actions/userInformation';
import { hideLoading, showLoading } from 'actions/loading';
import { hideLoadingChildren } from 'actions/childrenLoading';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlgin: 'center'
  },
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100
  },
  removeBotton: {
    width: '100%',
    marginTop: -20
  },
  upload: {
    width: '100%'
  }
}));

const ProfileDetails = props => {
  const { profile, className, ...rest } = props;

  const classes = useStyles();
  const [imageSrc, setImageSrc] = useState('');
  const dispatch = useDispatch();
  const handleImageChange = e => {
    
    const file = e.target.files[0];
    if (file) {
      dispatch(showLoading());
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child('folder/' + file.name).put(file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setFormState(formState => ({
          //   ...formState,
          //   values: {
          //     ...formState.values,
          //     progress: progress
          //   }
          // }));
        },
        error => {
          dispatch(hideLoadingChildren());
          toastError('Có lỗi xảy ra vui lòng thử lại');
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            var username = JSON.parse(sessionStorage.getItem('USER')).username;
            var data = {
              username: username,
              avatar: url
            };
            callAPI('Account/updateAccountAvatar', 'PUT', data)
              .then(res => {
                if (res.data === true) {
                  dispatch(hideLoading());
                  toastSuccess('Cập nhật ảnh đại diện thành công');
                  dispatch(actUpdateUserAvatar(data.avatar));
                } else {
                  dispatch(hideLoading());
                  toastError('Cập nhật ảnh đại diện thất bại');
                }
              })
              .catch(err => {
                console.log(err);
              });
          });
          // document.getElementById('file').value = null;
        }
      );
    }
  };
  const handRemoveAvatar = () => {
    var username = JSON.parse(sessionStorage.getItem('USER')).username;
    var data = {
      username: username,
      avatar: null
    };
    callAPI('Account/updateAccountAvatar', 'PUT', data)
      .then(res => {
        if (res.data === true) {
          setOpen(false);
          dispatch(hideLoading());
          toastSuccess('Cập nhật ảnh đại diện thành công');
          dispatch(actUpdateUserAvatar(data.avatar));
        } else {
          setOpen(false);
          dispatch(hideLoading());
          toastError('Cập nhật ảnh đại diện thất bại');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <Avatar className={classes.avatar} src={profile.avatar}>
          {/* <img src="" id="avatar" style={{width : 100, height:  100}} /> */}
        </Avatar>

        <Typography className={classes.name} gutterBottom variant="h3">
          {profile.fullname}
        </Typography>
        <Typography color="textSecondary" variant="body1">
          {profile.role}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {profile.username}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          component="label"
          className={classes.upload}>
          Cập nhật ảnh đại diện
          <input
            id="inputFileToLoad"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </Button>{' '}
      </CardActions>
      {profile.avatar && profile.avatar !== '' ? (
        <CardActions>
          <Button
            className={classes.removeBotton}
            variant="contained"
            onClick={handleClickOpen}>
            Gỡ ảnh đại diện
          </Button>
        </CardActions>
      ) : null}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
          <p style={{ fontSize: 20 }}>
            Bạn có chắc chắn muốn gỡ ảnh đại diện không?
          </p>
        </DialogTitle>

        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            onClick={handRemoveAvatar}
            color="primary"
            variant="contained"
            style={{ width: 100 }}>
            Đồng ý
          </Button>
        </DialogActions>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            onClick={handleClose}
            variant="contained"
            style={{ width: 100 }}>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default ProfileDetails;
