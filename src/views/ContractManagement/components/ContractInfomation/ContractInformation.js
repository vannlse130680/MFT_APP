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
import Header from '../Header';
import HeaderBack from '../Header/HeaderBack';
import CustomerInformation from './CustomerInformation/CustomerInformation';
import GeneralInformation from './GeneralInformation/GeneralInformation';


import TreeInformation from './TreeInformation/TreeInformation';



const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const ContractInformation = props => {
  const { match, history } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id, tab, username } = match.params;
  console.log(id);

  useEffect(() => {
    // dispatch(showLoading());
    // // var username = JSON.parse(localStorage.getItem('USER')).username;
    // // console.log(username)

    // callAPI(`Garden/getGardenAndPlantTypeById/${id}`, 'GET', null)
    //   .then(res => {
    //     if (res.status === 200) {
    //       dispatch(actFetchGardensAllInfor(res.data[0]));
    //       dispatch(hideLoading());
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }, []);

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  const tabs = [
    { value: 'general', label: 'Tổng quát' },
    { value: 'customer', label: 'Khách hàng' },
    { value: 'tree', label: 'Tiến độ cây' },
    { value: 'crop', label: 'Mùa vụ' }
  ];

  if (!tab) {
    return <Redirect to={`/contract/${id}/${username}/general`} />;
  }

  if (!tabs.find(t => t.value === tab)) {
    return <Redirect to="/errors/error-404" />;
  }

  return (
    <Page className={classes.root} title="Quản lý vườn">
      <AuthGuard roles={['Nông dân']} />
      <HeaderBack />
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
        {tab === 'customer' && <CustomerInformation />}
        {tab === 'tree' && <TreeInformation />}
        {tab === 'general' && <GeneralInformation />}
        {/* {tab === 'logs' && <Logs />} */}
      </div>
    </Page>
  );
};

export default ContractInformation;
