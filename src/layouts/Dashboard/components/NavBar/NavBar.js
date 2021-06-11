import React, { Fragment, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Divider, Paper, Avatar, Typography } from '@material-ui/core';
import { Hidden } from '@material-ui/core';

import useRouter from 'utils/useRouter';
import { Navigation } from 'components';
import navigationConfig from './navigationConfig';
import navShipper from './navigationConfigShipper';
import navAdmin from './navigationConfigAdmin';
import callAPI from 'utils/callAPI';
import { ConversationToolbar } from 'views/Chat/components/ConversationDetails/components';
import { actFetchUserInfor } from 'actions/userInformation';
import { hideLoading, showLoading } from 'actions/loading';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    overflowY: 'auto'
  },
  content: {
    padding: theme.spacing(2)
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  },
  divider: {
    marginTop: theme.spacing(2)
  },
  navigation: {
    marginTop: theme.spacing(2)
  }
}));

const NavBar = props => {
  const [profile, setProfile] = useState({});
  const userInforStore = useSelector(state => state.userInfor);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(showLoading())
    var user = localStorage.getItem('USER');
    if (user) {
      var data = JSON.parse(user);
      // console.log(data);
      setProfile(data);

    }
    
    
    var username = JSON.parse(localStorage.getItem('USER')).username;
    callAPI(`Account/${username}`, 'GET', null).then(res => {
      if(res.status === 200) {
        dispatch(hideLoading())
        dispatch(actFetchUserInfor(res.data))
      }
    }).catch((err) => {
      console.log(err)
    });
  }, []);
  
  const { openMobile, onMobileClose, className, ...rest } = props;

  const classes = useStyles();
  const router = useRouter();
  const session = useSelector(state => state.session);

  useEffect(() => {
    if (openMobile) {
      onMobileClose && onMobileClose();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.location.pathname]);

  const navbarContent = (
    <div className={classes.content}>
      <div className={classes.profile}>
        <Avatar
          alt="Person"
          className={classes.avatar}
          component={RouterLink}
          src={userInforStore.avatar}
          to="/settings/general"
        />
        <Typography className={classes.name} variant="h4">
          {userInforStore.fullname}
        </Typography>
        <Typography variant="body2">{userInforStore.role}</Typography>
      </div>
      <Divider className={classes.divider} />
      <nav className={classes.navigation}>
        {(profile.role === 'Nông dân'
          ? navigationConfig
          : profile.role === 'Shipper'
          ? navShipper
          : navAdmin
        ).map(list => (
          <Navigation
            component="div"
            key={list.title}
            pages={list.pages}
            title={list.title}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary">
          <div {...rest} className={clsx(classes.root, className)}>
            {navbarContent}
          </div>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Paper
          {...rest}
          className={clsx(classes.root, className)}
          elevation={1}
          square>
          {navbarContent}
        </Paper>
      </Hidden>
    </Fragment>
  );
};

NavBar.propTypes = {
  className: PropTypes.string,
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
