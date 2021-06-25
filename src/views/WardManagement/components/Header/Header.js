import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Axios from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import ImportIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = props => {
  const { onAddEvent, className, ...rest } = props;

  const classes = useStyles();
  // const onAddEventHandle = (params) => {
  //   onAddEvent()
  // }
  const handleFileSelect = () => {
    var formData = new FormData();
    var imagefile = document.querySelector('#inputFileToLoad');

    formData.append('file', imagefile.files[0]);
    // Axios.post('http://leminhnhan.cosplane.asia/api/City/addCity', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // });
    document.getElementById('inputFileToLoad').value = '';
    onAddEvent(formData);
  };
  const resetFile = () => {};
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            Quản lý
          </Typography>
          <Typography component="h1" variant="h3">
            Xã/ Thị Trấn
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            component="label"
            onClick={resetFile}>
            <ImportIcon />
            Import từ file Excel
            <input
              id="inputFileToLoad"
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileSelect}
              hidden
            />
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
