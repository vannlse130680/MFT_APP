import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Button, Hidden } from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';

const useStyles = makeStyles(theme => ({
  root: {},
  summaryButton: {
    backgroundColor: theme.palette.white
  },
  barChartIcon: {
    marginRight: theme.spacing(1)
  },
  image: {
    width: '100%',
    maxHeight: 400
  }
}));

const Header = props => {
  const [profile, setProfile] = useState({});
  const userInforStore = useSelector(state => state.userInfor);
  // useEffect(() => {
  //   var user = localStorage.getItem('USER');
  //   if (user) {
  //     var data = JSON.parse(user);
  //     // console.log(data);
  //     setProfile(data);
      
  //   }
  // }, []);
  const { className, ...rest } = props;

  const classes = useStyles();
  const session = useSelector(state => state.session);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="center"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid
          item
          md={6}
          xs={12}
        >
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            Trang chủ
          </Typography>
          <Typography
            component="h1"
            gutterBottom
            variant="h3"
          >
            Xin chào, {userInforStore.fullname}
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle1"
          >
            Chào mừng bạn đến trình quản lý của người dùng {userInforStore.role} 
          </Typography>
          {/* <Button
            className={classes.summaryButton}
            edge="start"
            variant="contained"
          >
            <BarChartIcon className={classes.barChartIcon} />
            View summary
          </Button> */}
        </Grid>
        <Hidden smDown>
          <Grid
            item
            md={6}
          >
            <img
              alt="Cover"
              className={classes.image}
              src="/images/undraw_growth_analytics_8btt.svg"
            />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
