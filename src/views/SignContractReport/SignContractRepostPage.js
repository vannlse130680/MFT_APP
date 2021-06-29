import { makeStyles } from '@material-ui/styles';
import { AuthGuard, Page } from 'components';
import React from 'react';
import CancelContractReport from './CancelContractReport';
import Header from './components/Header';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const SignContractRepostPage = () => {
  const classes = useStyles();
  return (
    <Page className={classes.root} title="Thống kê">
      <AuthGuard roles={['Nông dân']}></AuthGuard>
      <Header />
      <CancelContractReport/>
    </Page>
  );
};

export default SignContractRepostPage;
