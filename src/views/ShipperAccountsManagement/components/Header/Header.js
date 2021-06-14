import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import AddIcon from '@material-ui/icons/Add';

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
            Quản lý
          </Typography>
          <Typography component="h1" variant="h3">
            Tài khoản giao hàng
          </Typography>
        </Grid>
        <Grid item>
          <Button color="primary" variant="contained" onClick={onAddEvent}>
            <AddIcon />
            Thêm tài khoản giao hàng
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
