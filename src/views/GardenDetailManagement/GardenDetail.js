import { Divider, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { actFetchGardensAllInfor } from 'actions/gardenInfor';
import { hideLoading, showLoading } from 'actions/loading';
import { Page } from 'components';
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
    
    callAPI(`Garden/getGardenById/${id}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          
          dispatch(actFetchGardensAllInfor(res.data[0]))
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

  // const [value, setValue] = useState(true); //
  // const [allInfor, setAllInfor] = useState({}); //
  // const gardensStore = useSelector(state => state.gardens);
 
  

  // const [gardens, setGardens] = useState(initGardensValue);
  // const [events, setEvents] = useState([]);
  // const [resetPage, setResetPage] = useState(false);
  // const [selectedGarden, setSelectedGarden] = useState({});
  // const [eventModal, setEventModal] = useState({
  //   open: false,
  //   event: null
  // });

  // const handleModalClose = () => {
  //   setEventModal({
  //     open: false,
  //     event: null
  //   });
  // };
  // const handleEventAdd = data => {
  //   // setEvents(events => [...events, event]);

  //   callAPI('Garden/addGarden', 'POST', data)
  //     .then(res => {
  //       if (res.status === 200) {
  //         if(res.data) {
  //           toastSuccess("Tạo vườn thành công !")
  //           setValue(!value);
  //           setEventModal({
  //             open: false,
  //             event: null
  //           });
  //         } else {
  //           toastError("Mã vườn đã tồn tại !")
  //         }

  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };
  // const handleEventDelete = event => {
  //   setEvents(events => events.filter(e => e.id !== event.id));
  //   setEventModal({
  //     open: false,
  //     event: null
  //   });
  // };
  // const handleEventEdit = data => {
  //   // setEvents(events => events.map(e => (e.id === event.id ? event : e)));
  //   console.log(data)
  //   callAPI('Garden/updateGarden', 'PUT', data).then(res => {
  //     if (res.status === 200) {
  //       if(res.data) {
  //         toastSuccess("Cập nhật vườn thành công !")
  //         setValue(!value);
  //         setEventModal({
  //           open: false,
  //           event: null
  //         });
  //       } else {
  //         toastError("Mã vườn đã tồn tại !")
  //       }
  //     }
  //   }).catch((err) => {
  //     console.log(err)
  //   });
  // };

  // const handleFilter = () => {};
  // const handleSearch = keyword => {
  //   setResetPage(!resetPage)
  //   dispatch(actSearchGardens(keyword));
  // };
  // const handleEventNew = () => {
  //   setSelectedGarden(null)
  //   setEventModal({
  //     open: true,
  //     event: null
  //   });
  // };
  // const handleEventOpenEdit = (garden) => {
  //   garden.plantTypeObj = {
  //     id: garden.plantTypeID,
  //     plantTypeName: garden.plantTypeName
  //   }
  //   setSelectedGarden(garden)
  //   setEventModal({
  //     open: true,
  //     event: {}
  //   });
  // };

  

  return (
    <Page className={classes.root} title="Quản lý vườn">
    
      
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
