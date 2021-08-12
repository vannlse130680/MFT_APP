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
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from 'actions/loading';
import callAPI from 'utils/callAPI';
import Contracts from './components/Contracts/Contracts';
import HarvestSchedules from './components/HarvestSchedules/HarvestSchedules';
import Visitings from './components/Visitings.js/Visitings';

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

var username = JSON.parse(sessionStorage.getItem('USER'))
  ? JSON.parse(sessionStorage.getItem('USER')).username
  : null;

const Overview = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [contracts, setContracts] = useState([]);
  const [visitings, setVisitings] = useState([]);
  const [available, setAvailable] = useState(0);
  const [sold, setSold] = useState(0);
  const [harvestSchedule, setHarvestSchedule] = useState([])
  const [profile, setProfile] = useState({});
  useEffect(() => {
    console.log('cc');
    dispatch(showLoading());
    var user = sessionStorage.getItem('USER');
    if (user) {
      var data = JSON.parse(user);
      // console.log(data);
      console.log('lala');
      setProfile(data);
     
      callAPI(
        `Dashboard/GetPendingContractByUsername/${data.username}`,
        'GET',
        null
      ).then(res => {
        if (res.status === 200) {
          setContracts(res.data)
          
        }
      });
      callAPI(
        `Dashboard/getAllVisitingScheduleByUsernameForDashboard/${data.username}`,
        'GET',
        null
      ).then(res => {
        if (res.status === 200) {
          setVisitings(res.data)
        }
      });
      callAPI(
        `ContractDetail/getHarvestDateByFarmerUsername/${data.username}`,
        'GET',
        null
      ).then(res => {
        if (res.status === 200) {
          setHarvestSchedule(res.data)
        }
      });
      callAPI(
        `Tree/getSoldTree/${data.username}`,
        'GET',
        null
      ).then(res => {
        if (res.status === 200) {
          setSold(res.data.length)
        }
      });
      callAPI(
        `Tree/getActiveTree/${data.username}`,
        'GET',
        null
      ).then(res => {
        if (res.status === 200) {
          setAvailable(res.data.length)
        }
      });
      
      dispatch(hideLoading());
    } else {
      dispatch(hideLoading());
    }
  }, []);

  return (
    <Page className={classes.root} title="Trang chủ">
      <Header />
      {profile.role === 'Nông dân' ? (
        <div>
          {' '}
          <Statistics className={classes.statistics} contracts={contracts} visitings={visitings} harvestSchedule={harvestSchedule}/>
          <Notifications className={classes.notifications} available={available} sold={sold} />
          {/* <Projects className={classes.projects} /> */}
          <Contracts className={classes.projects} contracts={contracts}/>
          <HarvestSchedules className={classes.projects} harvestSchedule={harvestSchedule}/>
          <Visitings className={classes.projects} visitings={visitings}/>
          {/* <Todos className={classes.todos} /> */}
        </div>
      ) : null}
    </Page>
  );
};

export default Overview;
