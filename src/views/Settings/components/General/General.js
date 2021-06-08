import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import axios from 'utils/axios';
import { ProfileDetails, GeneralSettings } from './components';
import callAPI from 'utils/callAPI';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from 'actions/loading';

const useStyles = makeStyles(() => ({
  root: {}
}));

const General = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const profile = useSelector(state => state.userInfor);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(showLoading());
  //   var username = JSON.parse(localStorage.getItem('USER')).username;
  //   callAPI(`Account/${username}`, 'GET', null)
  //     .then(res => {
  //       if (res.status === 200) {
  //         dispatch(hideLoading())
  //         setProfile(res.data);
  //         console.log(res.data)
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, []);

  if (!profile) {
    return null;
  }

  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}>
      <Grid item lg={4} md={6} xl={3} xs={12}>
        <ProfileDetails profile={profile} />
      </Grid>
      <Grid item lg={8} md={6} xl={9} xs={12}>
        <GeneralSettings profile={profile} />
      </Grid>
    </Grid>
  );
};

General.propTypes = {
  className: PropTypes.string
};

export default General;
