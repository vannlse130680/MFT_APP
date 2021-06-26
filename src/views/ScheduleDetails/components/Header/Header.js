import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = props => {
  const { onAddEvent, className, ...rest } = props;

  const classes = useStyles();
  // const onAddEventHandle = (params) => {
  //   onAddEvent()
  // }
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            Thông tin
          </Typography>
          <Typography component="h1" variant="h3">
            Chi tiết lịch vận chuyển
          </Typography>
        </Grid>
        <Grid item>
          <Button
            className={classes.actionIcon}
            color="primary"
            component={RouterLink}
            size="small"
            to="/transport/update"
            variant="contained">
            {' '}
            {/* <ViewIcon className={classes.buttonIcon} /> */}
            <ArrowBackIcon/>
            Về lịch vận chuyển
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
