import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Popover,
  CardHeader,
  CardActions,
  Divider,
  Button,
  colors
} from '@material-ui/core';

import { NotificationList, EmptyList } from './components';
import firebase from '../../firebase/firebase';

const useStyles = makeStyles(() => ({
  root: {
    width: 350,
    maxWidth: '100%'
  },
  actions: {
    backgroundColor: colors.grey[50],
    justifyContent: 'center'
  }
}));
const handleDeleteAll = () => {
  
  let dbCon = firebase.database().ref('/notification/');
  dbCon.once('value', function(snapshot) {
    snapshot.forEach(function(child) {
      // console.log(child.val())
      var username = JSON.parse(sessionStorage.getItem('USER'))
        ? JSON.parse(sessionStorage.getItem('USER')).username
        : null;
      if (child.val().farmer === username) {
        
        child.ref.remove()
      }
    });
  });
};

const NotificationsPopover = props => {
  const { notifications, anchorEl,onClickNoti, ...rest } = props;
  console.log(notifications);
  const classes = useStyles();

  return (
    <Popover
      {...rest}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}>
      <div className={classes.root}>
        <CardHeader title="Thông báo" />
        <Divider />
        {notifications.length > 0 ? (
          <NotificationList notifications={notifications} onClickNoti={onClickNoti} />
        ) : (
          <EmptyList />
        )}
        <Divider />
        <CardActions className={classes.actions}>
          <Button size="small" onClick={handleDeleteAll}>
            Xóa tất cả
          </Button>
        </CardActions>
      </div>
    </Popover>
  );
};

NotificationsPopover.propTypes = {
  anchorEl: PropTypes.any,
  className: PropTypes.string,
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default NotificationsPopover;
