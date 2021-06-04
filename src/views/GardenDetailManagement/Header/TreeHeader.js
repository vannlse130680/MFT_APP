import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(() => ({
  root: {},
  fr: {
    float: 'right'
  }
}));

const TreeHeader = props => {
  const { onAddEvent, className, ...rest } = props;

  const classes = useStyles();
  // const onAddEventHandle = (params) => {
  //   onAddEvent()
  // }
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Button
        className={classes.fr}
        color="primary"
        variant="contained"
        onClick={onAddEvent}>
        <AddIcon />
        Thêm cây mới
      </Button>
    </div>
  );
};

export default TreeHeader;
