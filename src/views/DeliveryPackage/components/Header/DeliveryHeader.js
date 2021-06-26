import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {}
}));

const DeliveryHeader = props => {
  const { onAddEvent, className,contractId, ...rest } = props;

  const classes = useStyles();
  // const onAddEventHandle = (params) => {
  //   onAddEvent()
  // }
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            Danh sách
          </Typography>
          <Typography component="h1" variant="h3">
            Đơn hàng
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" component={RouterLink} to={`/contract/${contractId}/detail`}>
            <ArrowBackIcon />
            Về chi tiết hợp đồng
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeliveryHeader;
