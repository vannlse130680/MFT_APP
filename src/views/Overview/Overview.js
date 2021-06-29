import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import firebase from '../../firebase/firebase';
import { Page } from 'components';
import {
  Header,
  Statistics,
  Notifications,
  Projects,
  Todos
} from './components';
import { result } from 'validate.js';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  statistics: {
    marginTop: theme.spacing(3)
  },
  notifications: {
    marginTop: theme.spacing(6)
  },
  projects: {
    marginTop: theme.spacing(6)
  },
  todos: {
    marginTop: theme.spacing(6)
  }
}));

const Overview = () => {
  const classes = useStyles();
  

  return (
    <Page className={classes.root} title="Trang chủ">
      {/* {todoList ? todoList.map((item, index) => 
        <div key={index}>{item.title}</div>
      ) : null} */}
      <Header />
      {/* <Statistics className={classes.statistics} />
      <Notifications className={classes.notifications} />
      <Projects className={classes.projects} />
     
      <Todos className={classes.todos} /> */}
    </Page>
  );
};

export default Overview;
