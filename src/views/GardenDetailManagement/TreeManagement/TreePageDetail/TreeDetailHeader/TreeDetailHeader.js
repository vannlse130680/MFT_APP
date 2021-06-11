import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import useRouter from 'utils/useRouter';

const useStyles = makeStyles(() => ({
  root: {}
}));

const TreeDetailHeader = props => {
  const { onAddEvent, className, gardenId, ...rest } = props;
  const router = useRouter();

  const classes = useStyles();
  // const onAddEventHandle = (params) => {
  //   onAddEvent()
  // }
  const handleBackRouter = params => {
    router.history.goBack();
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h1" variant="h3">
            Thông tin của cây
          </Typography>
        </Grid>
        <Grid item>
          <Button
            component={RouterLink}
            to={`/gardenManagement/garden/${gardenId}/trees`}>
            <ArrowBackIcon />
            Về danh sách cây
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default TreeDetailHeader;
