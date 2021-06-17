import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MomentUtils from '@date-io/moment';
import { Provider as StoreProvider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { renderRoutes } from 'react-router-config';

import theme from './theme';
import { configureStore } from './store';
import routes from './routes';
import guestRoutes from './guestRoutes';
import {
  ScrollReset,
  GoogleAnalytics,
  CookiesNotification,
  AuthGuard
} from './components';
import './mixins/chartjs';
import './mixins/moment';
import './mixins/validate';
import './mixins/prismjs';
import './mock';
import './assets/scss/index.scss';
import { ToastContainer, toast } from 'react-toastify';
import GlobalLoading from 'utils/globalLoading';

const history = createBrowserHistory();
const store = configureStore();

const App = () => {
  useEffect(() => {
    console.log('I have been mounted');
  }, []);
  const checkRole = () => {
    var user = localStorage.getItem('USER');
    if (user) {
      var role = JSON.parse(user).role;
      console.log(role);
      return role.toUpperCase();
    }
    return 'GUEST';
  };
  // function myFunction() {
  //   var myWindow = window.open(
      
  //     'https://www.w3schools.com/jsref/met_win_open.asp',
  //     'width=200,height=100',
  //     window.location
  //   );
  //   var pathname = window.location.href;
  //   var url_popup = window.close(pathname);
  //   console.log(window.location.pathname);
  // }
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <GlobalLoading />
          <ToastContainer />
          {/* <button onClick={myFunction}>Try it</button> */}
          <Router history={history}>
            <AuthGuard></AuthGuard>
            <ScrollReset />
            <GoogleAnalytics />
            <CookiesNotification />
            {/*            
            {checkRole() === 'GUEST' ? renderRoutes(guestRoutes) : checkRole() === 'FARMER' ? renderRoutes(routes) :}
            {checkRole() === 'FARMER' ? renderRoutes(routes) : null} */}
            {/* {checkRole() === 'SHIPPER' ? null : null} */}
            {renderRoutes(routes)}
          </Router>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App;
