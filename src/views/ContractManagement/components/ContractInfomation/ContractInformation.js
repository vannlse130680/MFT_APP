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
import ContractDetailPage from 'views/ContractDetailManagement/ContractDetailPage';
import { Logs } from 'views/CustomerManagementDetails/components';
import Header from '../Header';
import HeaderBack from '../Header/HeaderBack';
import CustomerInformation from './CustomerInformation/CustomerInformation';
import GeneralInformation from './GeneralInformation/GeneralInformation';
import TreeProcess from './TreeProcessInformation/TreeProcess';

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
  const [value, setValue] = useState(true); //
  const { id, tab, username } = match.params;
  console.log(id);
  const [contractInfomation, setContractInformation] = useState({});
  useEffect(() => {
    let mounted = true;
    dispatch(showLoading());
    callAPI(`Contract/GetContractById/${id}`, 'GET', null)
      .then(res => {
        if (mounted) {
          if (res.status === 200) {
            dispatch(hideLoading());
            setContractInformation(res.data[0]);
            console.log(res.data);
          }
        }
      })
      .catch(err => {
        if (mounted) {
          console.log(err);
        }
      });

    return () => {
      mounted = false;
    };
  }, [value]);

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  const tabs = [
    { value: 'general', label: 'Tổng quát' },
    { value: 'customer', label: 'Khách hàng' },
    { value: 'tree', label: 'Chăm sóc cây' },
    { value: 'detail', label: 'Chi tiết hợp đồng' }
    // { value: 'exchange', label: 'Trao đổi' }
  ];

  if (!tab) {
    return <Redirect to={`/contract/${id}/general`} />;
  }

  if (!tabs.find(t => t.value === tab)) {
    return <Redirect to="/errors/error-404" />;
  }
  const onAccept = () => {
    setContractInformation({
      ...contractInfomation,
      status: 3
    });
  };
  const onConfirmCancel = () => {
    setContractInformation({
      ...contractInfomation,
      status: 2
    });
  };
  const onCancelContract = () => {
    setValue(!value);
  };

  const onTT = () => {
    setValue(!value);
  };
  const onComplete = () => {
    console.log('DONE mua vu');
    setValue(!value);
  };
  return (
    <Page className={classes.root} title="Quản lý hợp đồng">
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
        {tab === 'customer' && (
          <CustomerInformation
            customerUsername={contractInfomation.customerUsername}
          />
        )}
        {tab === 'tree' && (
          <TreeProcess
            contractInfomation={contractInfomation}
            contractStatus={contractInfomation.status}
            treeId={contractInfomation.treeID}
          />
        )}
        {tab === 'general' && (
          <GeneralInformation
            contractInfomation={contractInfomation}
            onAccept={onAccept}
            onConfirmCancel={onConfirmCancel}
            onCancelContract={onCancelContract}
            onTT={onTT}
          />
        )}
        {tab === 'detail' && (
          <ContractDetailPage
            contractInfomation={contractInfomation}
            totalCrop={contractInfomation.totalCrop}
            onComplete={onComplete}
            contractStatus={contractInfomation.status}
            customerUsername={contractInfomation.customerUsername}
            treeId={contractInfomation.treeID}
          />
        )}
        {/* {tab === 'logs' && <Logs />} */}
      </div>
    </Page>
  );
};

export default ContractInformation;
