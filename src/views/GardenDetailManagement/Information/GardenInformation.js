import {
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import General from './GeneralInformatin/General';
import PlantTypeInformation from './PlantTypeInfor/PlantTypeInformation';


const useStyles = makeStyles(theme => ({
  root: {},
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
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={1}>
      <Grid item lg={4} md={12} xl={4} xs={12}>
        <General customer={customer}/>
      </Grid>
      <Grid item lg={4} md={12} xl={4} xs={12}>
        <PlantTypeInformation customer={customer} />
      </Grid>
    </Grid>
  );
};

export default GardenInformation;
