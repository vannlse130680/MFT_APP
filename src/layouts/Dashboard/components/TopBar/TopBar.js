/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
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
  DialogActions,
  Divider
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
  const [role, setRole] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [todoList, setTodoList] = useState([]);
  // const popularSearches = [
  //   'Devias React Dashboard',
  //   'Devias',
  //   'Admin Pannel',
  //   'Project',
  //   'Pages'
  // ];
  const [popularSearches, setPopularSearches] = useState([
    'Quản lý hợp đồng',
    'Quản lý loại cây',
    'Quản lý vườn',
    'Lịch thu hoạch',
    'Yêu cầu tham quan vườn',
    'Lịch tham quan vườn',
    'Thống kê sản lượng thu hoạch',
    'Thống kê hủy hợp đồng',
    'Thống kê ký kết hợp đồng',
    'Thông tin cá nhân',
    'Đổi mật khẩu'
  ]);
  const [popularSearchesAdmin, setPopularSearchesAdmin] = useState([
    'Quản lý tài khoản nông dân',
    'Quản lý tài khoản khách hàng',
    'Quản lý tài khoản giao hàng',
    'Thông tin cá nhân',
    'Đổi mật khẩu'
  ]);
  const [popularSearchesShipper, setPopularSearchesShipper] = useState([
    'Lịch lấy hàng',
    'Lịch giao hàng',
    'Cập nhật lịch vận chuyển',
    'Thông tin cá nhân',
    'Đổi mật khẩu'
  ]);
  const [popularSearchesShow, setPopularSearchesShow] = useState([]);

  useEffect(() => {
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    var role = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).role
      : null;
    setRole(role);
    console.log(role);
    const todoRef = firebase.database().ref('notification');

    todoRef.on('value', snapshot => {
      const todos = snapshot.val();
      const todoList = [];

      for (const key in todos) {
        console.log(todos[key].farmer);
        if (todos[key].farmer === username) {
          todoList.push({ key, ...todos[key] });
        }
      }

      setNotifications(todoList.reverse());
    });
  }, []);
  useEffect(() => {
    if (role === 'Nông dân') {
      setPopularSearchesShow(popularSearches);
    }
    if (role === 'Quản lý') {
      setPopularSearchesShow(popularSearchesAdmin);
    }
    if (role === 'Shipper') {
      setPopularSearchesShow(popularSearchesShipper);
    }
  }, [role]);
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
    sessionStorage.clear();
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
  useEffect(() => {
    var arrSearch =
      role === 'Nông dân'
        ? popularSearches
        : role === 'Quản lý'
        ? popularSearchesAdmin
        : popularSearchesShipper;
    if (arrSearch) {
      var filtered = arrSearch.filter(function(str) {
        return str.toUpperCase().includes(searchValue.toUpperCase());
      });
      setPopularSearchesShow(filtered);
      console.log(filtered);
    }
  }, [searchValue]);

  const handleNotificationsOpen = () => {
    let dbCon = firebase.database().ref('/notification/');
    dbCon.once('value', function(snapshot) {
      snapshot.forEach(function(child) {
        // console.log(child.val())
        var username = JSON.parse(sessionStorage.getItem('USER'))
          ? JSON.parse(sessionStorage.getItem('USER')).username
          : null;
        if (child.val().farmer === username) {
          child.ref.update({
            isSeen: true
          });
          // child.ref.remove()
        }
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

  const handleClickNoti = () => {
    console.log('hahahah');
  };

  const getNumNoti = arr => {
    var result = 0;
    for (let index = 0; index < arr.length; index++) {
      if (!arr[index].isSeen) {
        // toastSuccess("La la la")
        result += 1;
      }
    }
    return result;
  };

  const handleSeachClick = search => {
    // 'Quản lý hợp đồng',
    //   'Quản lý loại cây',
    //   'Quản lý vườn',
    //   'Lịch thu hoạch',
    //   'Yêu cầu tham vườn',
    //   'Lịch tham quan vườn',
    //   'Thống kê sản lượng thu hoạch',
    //   'Thông kê hủy hợp đồng',
    //   'Thống kê ký kết hợp đồng',
    //   'Thông tin cá nhân',
    //   'Đổi mật khẩu';
    // 'Quản lý tài khoản nông dân',
    // 'Quản lý tài khoản khách hàng',
    // 'Quản lý tài khoản giao hàng',
    // 'Lịch lấy hàng',
    // 'Lịch giao hàng',
    // 'Cập nhật lịch vận chuyển',

    if (search === 'Quản lý hợp đồng') {
      history.push('/contract');
    }
    if (search === 'Quản lý loại cây') {
      history.push('/plantType');
    }
    if (search === 'Quản lý vườn') {
      history.push('/gardenManagement/garden');
    }
    if (search === 'Lịch thu hoạch') {
      history.push('/calendar/harvest');
    }
    if (search === 'Thống kê sản lượng thu hoạch') {
      history.push('/report/yield');
    }
    if (search === 'Yêu cầu tham quan vườn') {
      history.push('/management/visiting');
    }
    if (search === 'Lịch tham quan vườn') {
      history.push('/calendar/visit');
    }
    if (search === 'Thống kê hủy hợp đồng') {
      history.push('/report/cancelContract');
    }
    if (search === 'Thống kê ký kết hợp đồng') {
      history.push('/report/signContract');
    }
    if (search === 'Thông tin cá nhân') {
      history.push('/settings/general');
    }
    if (search === 'Đổi mật khẩu') {
      history.push('/settings/security');
    }


    if (search === 'Quản lý tài khoản nông dân') {
      history.push('/managementAccount/farmers');
    }
    if (search === 'Quản lý tài khoản khách hàng') {
      history.push('/managementAccount/customers');
    }
    if (search === 'Quản lý tài khoản giao hàng') {
      history.push('/managementAccount/shippers');
    }


    if (search === 'Lịch lấy hàng') {
      history.push('/transport/collect');
    }
    if (search === 'Lịch giao hàng') {
      history.push('/transport/delivery');
    }
    if (search === 'Cập nhật lịch vận chuyển') {
      history.push('/transport/update');
    }
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
            <p style={{ fontSize: 20 }}>Đăng xuất</p>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn đăng xuất không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Ở lại</Button>
            <Button onClick={handleLogout} color="primary">
              Đồng ý
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
                  {popularSearchesShow.map(search => (
                    <ListItem
                      button
                      key={search}
                      onClick={handleSeachClick.bind(this, search)}>
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
        onClickNoti={handleNotificationsClose}
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
