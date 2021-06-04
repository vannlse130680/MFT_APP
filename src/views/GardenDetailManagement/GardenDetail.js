import { Divider, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import React from 'react';
import { Redirect } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
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
  console.log(props);
  const { id, tab } = match.params;

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

  // if (!tabs.find(t => t.value === tab)) {
  //   return <Redirect to="/errors/error-404" />;
  // }

  // const [value, setValue] = useState(true); //
  // const gardensStore = useSelector(state => state.gardens);
  // const dispatch = useDispatch();
  // useEffect(() => {

  //   dispatch(showLoading());
  //   var username = JSON.parse(localStorage.getItem('USER')).username;
  //   // console.log(username)
  //   callAPI(`garden/${username}`, 'GET', null)
  //     .then(res => {
  //       if (res.status === 200) {
  //         dispatch(actFetchGardens(res.data));
  //         dispatch(hideLoading());
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, [value]);

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

  function encodeImageFileAsURL() {
    var filesSelected = document.getElementById('inputFileToLoad').files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];

      var fileReader = new FileReader();

      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64

        var newImage = document.createElement('img');
        newImage.src = srcData;
        newImage.style.cssText = 'width:200px;height:200px;';

        console.log(srcData);
        document.getElementById('imgTest').innerHTML = newImage.outerHTML;
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  }


  return (
    <Page className={classes.root} title="Customer Management Details">
      <input id="inputFileToLoad" type="file" onChange={encodeImageFileAsURL} />
      <div id="imgTest" ></div>
      
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
        {tab === 'trees' && <TreePage id={id} />}
        {/* {tab === 'logs' && <Logs />} */}
      </div>
    </Page>
  );
};

export default GardenDetailPage;
