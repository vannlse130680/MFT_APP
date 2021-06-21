import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Page } from 'components';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import General from './GeneralInformatin/General';
import PlantTypeInformation from './PlantTypeInfor/PlantTypeInformation';
import Header from './Header/Header';
const useStyles = makeStyles(theme => ({
  root: {padding : theme.spacing(3)},
  content: {
    padding: 0
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > * + *': {
      marginLeft: 0
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));

const GardenInformation = props => {
  const { customer, className, ...rest } = props;

  const classes = useStyles();

  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  return (
    <Page className={classes.root}>
      <Header/>
      <Grid
        {...rest}
       
        container
        spacing={5}>
        <Grid item lg={4} md={12} xl={4} xs={12}>
          <General customer={customer} />
        </Grid>
        <Grid item lg={4} md={12} xl={4} xs={12}>
          <PlantTypeInformation customer={customer} />
        </Grid>
      </Grid>
    </Page>
  );
};

export default GardenInformation;
