import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import { hideLoading, showLoading } from 'actions/loading';
import clsx from 'clsx';
import { GenericMoreButton } from 'components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch } from 'react-redux';
import callAPI from 'utils/callAPI';
import { Chart } from './components';

import CachedIcon from '@material-ui/icons/Cached';
import { Avatar } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  chart: {
    padding: theme.spacing(4, 2, 0, 2),
    height: 600
  },
  picker: {
    padding: theme.spacing(3)
  },
  button: {
    marginLeft: theme.spacing(3),
    marginBottom: 20
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  avatar: {
    backgroundColor: theme.palette.white,
    color: 'red',
    height: 48,
    width: 48
  }
}));

const CancelContractReport = props => {
  const { className, ...rest } = props;

  const [reportData, setReportData] = useState({});
  const [number, setNumber] = useState(0);
  // const [selectedDateStart, handleDateChangeStart] = useState(
  //   moment().toDate()
  // );

  // const [selectedDateEnd, handleDateChangeEnd] = useState(moment().toDate());
  useEffect(() => {
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    callAPI(`Contract/${username}`, 'GET', null).then(res => {
      if (res.status === 200) {
        var arr = res.data.filter(o => o.status === 2);
        setNumber(arr.length);
      }
    });
  }, []);
  const [lables, setLables] = useState([]);
  const classes = useStyles();

  return (
    <div>
      {' '}
      <Card {...rest} className={clsx(classes.root, className)}>
        <div>
          <Typography
            color="inherit"
            component="h3"
            gutterBottom
            variant="overline">
            Số lượng hợp đồng hủy
          </Typography>
          <div className={classes.details}>
            <Typography color="inherit" variant="h3">
              {number} hợp đồng
            </Typography>
          </div>
        </div>
      </Card>
      <Card {...rest} style={{ marginTop: 20 }}>
        {/* <Button variant="text" color="default" onClick={test}>
        á
      </Button> */}

        <CardHeader
          action={<GenericMoreButton />}
          title={
            'Thống kế số lượng hợp đồng đã hủy từ năm ' +
            moment()
              .subtract(4, 'year')
              .format('YYYY') +
            ' đến năm ' +
            moment().format('YYYY')
          }></CardHeader>
        {/* <div className={classes.picker}> */}
        {/* <DatePicker
          style={{ marginRight: 20 }}
          views={['year']}
          label="Từ năm"
          variant="inline"
          value={selectedDateStart}
          maxDate={selectedDateEnd}
          onChange={handleDateChangeStart}
          minDate={moment().subtract(4, 'year')}
          animateYearScrolling
        />
        <DatePicker
          readOnly={true}
          views={['year']}
          label="Đến năm"
          variant="inline"
          maxDate={new Date()}
          minDate={moment(selectedDateStart).toDate()}
          value={selectedDateEnd}
          minDateMessage="hahaah"
          onChange={handleDateChangeEnd}
          animateYearScrolling
        /> */}
        {/* </div> */}
        {/* <Button
        className={classes.button}
        variant="text"
        size="small"
        variant="contained"
        onClick={handleReport}
        color="primary">
        <CachedIcon />
        Thống kê
      </Button> */}
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Chart
                className={classes.chart}
                data={reportData}
                labels={lables}
              />
            </div>
          </PerfectScrollbar>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelContractReport;
