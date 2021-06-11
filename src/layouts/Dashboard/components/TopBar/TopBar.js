/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  AppBar,
  Badge,
  Button,
  IconButton,
  Toolbar,
  Hidden,
  Input,
  colors,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutlined';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import axios from 'utils/axios';
import useRouter from 'utils/useRouter';
import { PricingModal, NotificationsPopover, Label } from 'components';
import { logout } from 'actions';
import { toastSuccess } from 'utils/toastHelper';
import firebase from '../../../../firebase/firebase';
const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  search: {
    backgroundColor: 'rgba(255,255,255, 0.1)',
    borderRadius: 4,
    flexBasis: 300,
    height: 36,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: 'inherit'
  },
  searchInput: {
    flexGrow: 1,
    color: 'inherit',
    '& input::placeholder': {
      opacity: 1,
      color: 'inherit'
    }
  },
  searchPopper: {
    zIndex: theme.zIndex.appBar + 100
  },
  searchPopperContent: {
    marginTop: theme.spacing(1)
  },
  trialButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  trialIcon: {
    marginRight: theme.spacing(1)
  },
  notificationsButton: {
    marginLeft: theme.spacing(1)
  },
  notificationsBadge: {
    backgroundColor: colors.orange[600]
  },
  logoutButton: {
    marginLeft: theme.spacing(1)
  },
  logoutIcon: {
    marginRight: theme.spacing(1)
  },
  dialogTitle: {
    fontSize: 100
  }
}));

const TopBar = props => {
  const { onOpenNavBarMobile, className, ...rest } = props;

  const classes = useStyles();
  const { history } = useRouter();
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const notificationsRef = useRef(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [openSearchPopover, setOpenSearchPopover] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [todoList, setTodoList] = useState([]);
  useEffect(() => {
    const todoRef = firebase.database().ref('notification');

    todoRef.on('value', snapshot => {
      const todos = snapshot.val();
      const todoList = [];

      for (const key in todos) {
        todoList.push(todos[key]);
      }

      setNotifications(todoList);
    });
  }, []);
  // useEffect(() => {
  //   let mounted = true;

  //   const fetchNotifications = () => {
  //     axios.get('/api/account/notifications').then(response => {
  //       if (mounted) {
  //         console.log(response.data.notifications);
  //       }
  //     });
  //   };

  //   fetchNotifications();

  //   return () => {
  //     mounted = false;
  //   };
  // }, []);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    localStorage.clear();
    history.push('/auth/login');
    toastSuccess('Đăng xuất thành công !');
    dispatch(logout());
  };

  const handlePricingOpen = () => {
    setPricingModalOpen(true);
  };

  const handlePricingClose = () => {
    setPricingModalOpen(false);
  };

  const handleNotificationsOpen = () => {
    let dbCon = firebase.database().ref('/notification/');
    dbCon.once('value', function(snapshot) {
      snapshot.forEach(function(child) {
        child.ref.update({
          isSeen: true
        });
      });
    });
    setOpenNotifications(true);
  };

  const handleNotificationsClose = () => {
    setOpenNotifications(false);
  };

  const handleSearchChange = event => {
    setSearchValue(event.target.value);

    if (event.target.value) {
      if (!openSearchPopover) {
        setOpenSearchPopover(true);
      }
    } else {
      setOpenSearchPopover(false);
    }
  };

  const handleSearchPopverClose = () => {
    setOpenSearchPopover(false);
  };

  const popularSearches = [
    'Devias React Dashboard',
    'Devias',
    'Admin Pannel',
    'Project',
    'Pages'
  ];
  const handleClickNoti = () => {
    console.log('hahahah');
  };

  const getNumNoti = arr => {
    var result = 0;
    for (let index = 0; index < arr.length; index++) {
      if (!arr[index].isSeen) {
        result += 1;
      }
    }
    return result;
  };
  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color="primary">
      <Toolbar>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
            <p style={{ fontSize: 20 }}>
              Bạn có chắc chắn muốn đăng xuất không?
            </p>
          </DialogTitle>

          <DialogActions style={{ justifyContent: 'center' }}>
            <Button
              onClick={handleLogout}
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
              Ở lại
            </Button>
          </DialogActions>
        </Dialog>
        <RouterLink to="/">
          <img
            style={{ height: '40px' }}
            alt="Logo"
            src="/images/logos/logo.png"
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden smDown>
          <div className={classes.search} ref={searchRef}>
            <SearchIcon className={classes.searchIcon} />
            <Input
              className={classes.searchInput}
              disableUnderline
              onChange={handleSearchChange}
              placeholder="Tìm kiếm ở đây ..."
              value={searchValue}
            />
          </div>
          <Popper
            anchorEl={searchRef.current}
            className={classes.searchPopper}
            open={openSearchPopover}
            transition>
            <ClickAwayListener onClickAway={handleSearchPopverClose}>
              <Paper className={classes.searchPopperContent} elevation={3}>
                <List>
                  {popularSearches.map(search => (
                    <ListItem
                      button
                      key={search}
                      onClick={handleSearchPopverClose}>
                      <ListItemIcon>
                        <SearchIcon />
                      </ListItemIcon>
                      <ListItemText primary={search} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </ClickAwayListener>
          </Popper>
          {/* <Button
            className={classes.trialButton}
            onClick={handlePricingOpen}
            variant="contained">
            <LockIcon className={classes.trialIcon} />
            Trial expired
          </Button> */}
        </Hidden>
        <Hidden mdDown>
          <IconButton
            className={classes.notificationsButton}
            color="inherit"
            onClick={handleNotificationsOpen}
            ref={notificationsRef}>
            <Badge
              badgeContent={getNumNoti(notifications)}
              classes={{ badge: classes.notificationsBadge }}>
              {' '}
              <NotificationsIcon onClick={handleClickNoti} />
            </Badge>
          </IconButton>
          <Button
            className={classes.logoutButton}
            color="inherit"
            onClick={handleClickOpen}>
            <InputIcon className={classes.logoutIcon} />
            Đăng xuất
          </Button>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onOpenNavBarMobile}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
      <PricingModal onClose={handlePricingClose} open={pricingModalOpen} />
      <NotificationsPopover
        anchorEl={notificationsRef.current}
        notifications={notifications}
        onClose={handleNotificationsClose}
        open={openNotifications}
      />
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onOpenNavBarMobile: PropTypes.func
};

export default TopBar;
