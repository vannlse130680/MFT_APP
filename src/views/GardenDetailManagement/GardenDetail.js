import { Divider, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { actFetchGardensAllInfor } from 'actions/gardenInfor';
import { hideLoading, showLoading } from 'actions/loading';
import { AuthGuard, Page } from 'components';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import callAPI from 'utils/callAPI';
import { Logs } from 'views/CustomerManagementDetails/components';

import Header from './Header/Header';
import GardenInformation from './Information/GardenInformation';

import Results from './TreeManagement/Result/Results';
import TreePage from './TreeManagement/TreePage';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const GardenDetailPage = props => {
  const { match, history } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id, tab } = match.params;
  console.log(id);

  useEffect(() => {
    dispatch(showLoading());
    // var username = JSON.parse(localStorage.getItem('USER')).username;
    // console.log(username)

    callAPI(`Garden/getGardenAndPlantTypeById/${id}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(actFetchGardensAllInfor(res.data[0]));
          dispatch(hideLoading());
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  const tabs = [
    { value: 'information', label: 'Tổng quát' },
    { value: 'trees', label: 'Danh sách cây' }
  ];

  if (!tab) {
    return <Redirect to={`/gardenManagement/garden/${id}/information`} />;
  }

  if (!tabs.find(t => t.value === tab)) {
    return <Redirect to="/errors/error-404" />;
  }

 

  return (
    <Page className={classes.root} title="Quản lý vườn">
      <AuthGuard roles={['Nông dân']} />
      <Header />
      <Tabs
        style={{ marginTop: 20 }}
        className={classes.tabs}
        onChange={handleTabsChange}
        scrollButtons="auto"
        value={tab}
        variant="scrollable">
        {tabs.map(tab => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider className={classes.divider} />
      <div className={classes.content}>
        {tab === 'information' && <GardenInformation customer={{}} />}
        {tab === 'trees' && <TreePage gardenId={id} />}
        {/* {tab === 'logs' && <Logs />} */}
      </div>
    </Page>
  );
};

export default GardenDetailPage;
