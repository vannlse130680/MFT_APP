import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider
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

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  chart: {
    padding: theme.spacing(4, 2, 0, 2),
    height: 400
  },
  picker: {
    padding: theme.spacing(3)
  },
  button: {
    marginLeft: theme.spacing(3),
    marginBottom: 20
  }
}));

const CancelContractReport = props => {
  const { className, ...rest } = props;
  const data = {
    thisYear: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 10],
    lastYear: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
  };
  const [reportData, setReportData] = useState({});
  const [selectedDateStart, handleDateChangeStart] = useState(
    moment().toDate()
  );
  const dispatch = useDispatch();
  const [selectedDateEnd, handleDateChangeEnd] = useState(moment().toDate());
  const [lables, setLables] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    dispatch(showLoading());
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    callAPI(`Report/signPlantTypeReport/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());
          var data = res.data;
          var lables = [];
          var reportData = { thisYear: [] };
          for (let index = 0; index < data.length; index++) {
            console.log(data[index].plantTypeName);
            lables.push(data[index].plantTypeName);

            reportData.thisYear.push(data[index].signTime);
          }
          console.log(lables);
          setLables(lables);
          setReportData(reportData);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  const handleReport = () => {
    dispatch(showLoading());
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    var data = {
      username: username,
      minYear: parseInt(moment(selectedDateStart).format('YYYY'))
    };
    console.log(data);
    callAPI('Report/signPlantTypeReportWithRange', 'PUT', data)
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());
          console.log(res.data);
          var data = res.data;
          var lables = [];
          var reportData = { thisYear: [] };
          for (let index = 0; index < data.length; index++) {
            lables.push(data[index].plantTypeName);

            reportData.thisYear.push(data[index].signTime);
          }

          setLables(lables);
          setReportData(reportData);
        }
      })
      .catch(err => {
        console.log(err);
      });
    // console.log(moment(selectedDateStart).format('YYYY'));
    // console.log(moment(selectedDateEnd).format('YYYY'));
  };
  return (
    <Card
      {...rest}
      style={{ marginTop: 20 }}
      className={clsx(classes.root, className)}>
      <CardHeader
        action={<GenericMoreButton />}
        title="Thống kế số lượng hợp đồng đã được ký kết"></CardHeader>
      <div className={classes.picker}>
        <DatePicker
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
        />
      </div>
      <Button
        className={classes.button}
        variant="text"
        size="small"
        variant="contained"
        onClick={handleReport}
        color="primary">
        <CachedIcon />
        Thống kê
      </Button>
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
  );
};

export default CancelContractReport;
