import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import moment, { localeData } from 'moment';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Hidden,
  Typography,
  Tooltip,
  ButtonGroup,
  IconButton,
  Button
} from '@material-ui/core';
import ViewConfigIcon from '@material-ui/icons/ViewComfyOutlined';
import ViewWeekIcon from '@material-ui/icons/ViewWeekOutlined';
import ViewDayIcon from '@material-ui/icons/ViewDayOutlined';
import ViewAgendaIcon from '@material-ui/icons/ViewAgendaOutlined';
import 'moment/locale/vi';
import { CSVLink } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';
import callAPI from 'utils/callAPI';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Toolbar = props => {
  const {
    date,
    view,
    onDatePrev,
    onDateNext,
    onEventAdd,
    onViewChange,
    onDateToday,
    className,
    ...rest
  } = props;
  const [dataExport, setDataExport] = useState([{}]);
  const classes = useStyles();
  const headers = [
    { label: 'STT', key: 'id' },
    { label: 'Người gửi', key: 'farmer' },
    { label: 'Địa chỉ', key: 'address' },
    { label: 'Vườn', key: 'garden' },
    { label: 'Loại trái cây', key: 'plantType' },
    { label: 'Khối lượng', key: 'yield' },
    
    { label: 'Ngày', key: 'date' },
    { label: 'Trạng thái', key: 'status' },
  ];
  useEffect(() => {
    callAPI(
      'ContractDetail/getAllDeliveryScheduleToExportExcel',
      'GET',
      null
    )
      .then(res => {
        if (res.status === 200) {
          var data = res.data;
          var dataExport = [];
          for (let index = 0; index < data.length; index++) {
            var item = {
              id: index + 1,
              farmer: data[index].fullname,
              garden: data[index].gardenName,
              plantType: data[index].plantTypeName,
              yield: data[index].yield,

              address:
                data[index].address +
                ', ' +
                data[index].wardName +
                ', ' +
                data[index].districtName +
                ', ' +
                data[index].cityName,
              date: moment(data[index].delivery).format('DD/MM/YYYY'),
              status: ''
            };
            dataExport.push(item);
          }
          setDataExport(dataExport);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  const viewOptions = [
    {
      label: 'Month',
      value: 'dayGridMonth',
      icon: ViewConfigIcon
    },
    {
      label: 'Week',
      value: 'timeGridWeek',
      icon: ViewWeekIcon
    },
    {
      label: 'Day',
      value: 'timeGridDay',
      icon: ViewDayIcon
    },
    {
      label: 'Agenda',
      value: 'listWeek',
      icon: ViewAgendaIcon
    }
  ];
  // var headers = [
  //   { label: 'First Name', key: 'firstname' },
  //   { label: 'Last Name', key: 'lastname' },
  //   { label: 'Email', key: 'email' }
  // ];

  // var data = [
  //   { firstname: 'Ahmed', lastname: 'Tomi', email: 'ah@smthing.co.com' },
  //   { firstname: 'Raed', lastname: 'Labes', email: 'rl@smthing.co.com' },
  //   { firstname: 'Yezzi', lastname: 'Min l3b', email: 'ymin@cocococo.com' }
  // ];
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            Lịch
          </Typography>
          <Typography component="h1" variant="h3">
            Lịch lấy hàng
          </Typography>
        </Grid>
        <Grid item>
          <CSVLink data={dataExport} headers={headers} filename="lich_lay_hang.csv">
            <Button color="primary" variant="contained">
              <GetAppIcon />
              Xuất File excel
            </Button>
          </CSVLink>
        </Grid>
      </Grid>
      <Grid alignItems="center" container justify="space-between" spacing={3}>
        <Grid item>
          <ButtonGroup>
            <Button onClick={onDatePrev}>Sau</Button>
            <Button onClick={onDateToday}>Hôm nay</Button>
            <Button onClick={onDateNext}>Trước</Button>
          </ButtonGroup>
        </Grid>
        <Hidden smDown>
          <Grid item>
            <Typography variant="h3">
              {moment(date)
                .locale('vi')
                .format('MMMM YYYY')}
            </Typography>
          </Grid>
          {/* <Grid item>
            {viewOptions.map(viewOption => {
              const Icon = viewOption.icon;

              return (
                <Tooltip key={viewOption.value} title={viewOption.label}>
                  <IconButton
                    color={viewOption.value === view ? 'primary' : 'default'}
                    onClick={() => onViewChange(viewOption.value)}>
                    <Icon />
                  </IconButton>
                </Tooltip>
              );
            })}
          </Grid> */}
        </Hidden>
      </Grid>
    </div>
  );
};

Toolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  date: PropTypes.any.isRequired,
  onDateNext: PropTypes.func,
  onDatePrev: PropTypes.func,
  onDateToday: PropTypes.func,
  onEventAdd: PropTypes.func,
  onViewChange: PropTypes.func,
  view: PropTypes.string.isRequired
};

export default Toolbar;
