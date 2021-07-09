import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Axios from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import ImportIcon from '@material-ui/icons/GetApp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import useRouter from 'utils/useRouter';
const useStyles = makeStyles(() => ({
  root: {}
}));

const BackHeader = props => {
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
  
  const router = useRouter()
  console.log(router)
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          {/* <Typography component="h2" gutterBottom variant="overline">
            Quản lý
          </Typography>
          <Typography component="h1" variant="h3">
            Quận/ Huyện
          </Typography> */}
        </Grid>
        <Grid item>
          <Button component={RouterLink} to="/managementAddress/cities">
            <ArrowBackIcon />
            Về Tỉnh/Thành Phố
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BackHeader;
