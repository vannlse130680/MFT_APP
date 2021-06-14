import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(theme => ({
  root: {},
  getAppIcon: {
    marginRight: theme.spacing(1)
  }
}));

const Header = props => {
  const { invoice, className, ...rest } = props;

  const classes = useStyles();

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
            Chính sách
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            MUA BÁN CÂY GIỮA NÔNG DÂN VÀ KHÁCH HÀNG
          </Typography>
        </Grid>
        <Grid item>
          {/* <Button
            color="primary"
            variant="contained"
          >
            <GetAppIcon className={classes.getAppIcon} />
            Download PDF
          </Button> */}
        </Grid>
      </Grid>
    </div>
  );
};



export default Header;
