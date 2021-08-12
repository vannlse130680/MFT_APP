import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import uuid from 'uuid/v1';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Tooltip
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardOutlined';
import PaymentIcon from '@material-ui/icons/PaymentOutlined';
import MailIcon from '@material-ui/icons/MailOutlineOutlined';
import useRouter from 'utils/useRouter';
import EcoIcon from '@material-ui/icons/Eco';
import AssignmentIcon from '@material-ui/icons/Assignment';

const useStyles = makeStyles(theme => ({
  root: {},
  value: {
    fontWeight: theme.typography.fontWeightMedium
  },
  type: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

const Notifications = props => {
  const { className, available, sold, ...rest } = props;

  const classes = useStyles();
  const notifications = [
    {
      id: uuid(),
      value: 6,
      type: 'cây có sẵn',
      message: 'có trong hệ thống'
    },
    {
      id: uuid(),
      value: 2,
      type: 'cây đã cho thuê',
      message: 'có trong hệ thống'
    }
    // {
    //   id: uuid(),
    //   value: 1,
    //   type: 'payout',
    //   message: 'that needs your confirmation'
    // }
  ];

  const icons = {
    'cây có sẵn': <EcoIcon />,
    'cây đã cho thuê': <AssignmentIcon />
  };
  const router = useRouter();
  const handleClickIcon = noti => {
    console.log(noti);
    if (noti.type === 'cây có sẵn') {
      router.history.push('/treelist/available');
    } else router.history.push('/treelist/sold');
  };
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <List>
        {notifications.map((notification, i) => (
          <ListItem
            divider={i < notifications.length - 1}
            key={notification.id}>
            <ListItemIcon>{icons[notification.type]}</ListItemIcon>
            <ListItemText>
              <Typography variant="body1">
                <span className={classes.value}>
                  {notification.type === 'cây có sẵn' ? available : sold}
                </span>{' '}
                <span className={classes.type}>{notification.type}</span>{' '}
                {notification.message}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Tooltip title="View">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={handleClickIcon.bind(this, notification)}>
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

Notifications.propTypes = {
  className: PropTypes.string
};

export default Notifications;
