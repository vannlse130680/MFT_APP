import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = props => {
  const {onAddEvent, className, ...rest } = props;

  const classes = useStyles();
  // const onAddEventHandle = (params) => {
  //   onAddEvent()
  // }
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            Quản lý
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            Hợp đồng
          </Typography>
        </Grid>
        {/* <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={onAddEvent}
          >
            <AddIcon />
            Thêm vườn mới ád
          </Button>
        </Grid> */}
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
