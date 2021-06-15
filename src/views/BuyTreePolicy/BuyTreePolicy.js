import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Divider } from '@material-ui/core';

import axios from 'utils/axios';
import { AuthGuard, Page } from 'components';
import Header from './Header';
import Details from './Detail/Details';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    margin: theme.spacing(2, 0)
  }
}));

const InvoiceDetails = () => {
  const classes = useStyles();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchInvoice = () => {
      axios.get('/api/invoices/1').then(response => {
        if (mounted) {
          setInvoice(response.data.invoice);
        }
      });
    };

    fetchInvoice();

    return () => {
      mounted = false;
    };
  }, []);

  if (!invoice) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Chính sách mua bán cây"
    >
      <AuthGuard roles={['Nông dân']}/>
      <Header  />
      <Divider className={classes.divider} />
      <Details/>
    </Page>
  );
};

export default InvoiceDetails;
