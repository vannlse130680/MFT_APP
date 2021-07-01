import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Bar, Line } from 'react-chartjs-2';
import { makeStyles, useTheme } from '@material-ui/styles';
import { colors, Button } from '@material-ui/core';
import callAPI from 'utils/callAPI';
import moment from 'moment';
import { hideLoading, showLoading } from 'actions/loading';
import { useDispatch } from 'react-redux';
import randomColor from 'randomcolor';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative'
  }
}));

const Chart = props => {
  const { data: dataProp, labels, className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();
  const [plantType, setPlantType] = useState([{}]);
  const [dataTest, setDataTest] = useState({
    datasets: [],
    labels: []
  });
  const dispatch = useDispatch()

  useEffect(() => {
    var username = JSON.parse(sessionStorage.getItem('USER'))
      ? JSON.parse(sessionStorage.getItem('USER')).username
      : null;
    callAPI(`PlantType/getPlantTypeName/${username}`, 'GET', null).then(res => {
      if (res.status === 200) {
        setPlantType(res.data);
      }
    });
  }, []);
  useEffect(() => {
    dispatch(showLoading())
    async function fetchMyAPI() {
      var arr = [];

      for (let index = 0; index < plantType.length; index++) {
        // console.log(plantType[index].id);
        if (plantType[index].id) {
          await callAPI(
            `Report/CancelPlantTypeReport/${plantType[index].id}`,
            'GET',
            null
          ).then(res => {
            // console.log(res.data);
            var response = res.data;
            var test = [];
            for (let index = 4; index >= 0; index--) {
              var objTest = response.find(
                o =>
                  o.cancelYear ===
                  parseInt(
                    moment()
                      .subtract(index, 'year')
                      .format('YYYY')
                  )
              );
              test.push(objTest ? objTest.cancelTime : 0);
            }
            // for (let index = 0; index < dataTest.labels.length; index++) {
            //   var objTest = tmp.find(
            //     o => o.cancelYear === parseInt(dataTest.labels[index])
            //   );
            //   test.push(objTest ? objTest.cancelTime : 0);
            // }

            // for (let index = 0; index < tmp.length; index++) {
            //   test.push(tmp[index].id);
            // }
            let color = randomColor();
            var obj = {
              fill: false,
              borderColor: color,
              label: plantType[index].plantTypeName,
              backgroundColor: color,
              data: test
            };
            arr.push(obj);
          });
        }
      }
      // console.log(arr);
      var arrLabels = [];
      for (let index = 4; index >= 0; index--) {
        arrLabels.push(
          moment()
            .subtract(index, 'year')
            .format('YYYY')
        );
      }
      
      
      setDataTest({...dataTest, datasets: arr,  labels: arrLabels});
      dispatch(hideLoading())
    }

    fetchMyAPI();
  }, [plantType]);

  // const data = {
  //   datasets: [
  //     {
  //       label: 'Xoài',
  //       backgroundColor: theme.palette.primary.main,
  //       data: dataProp.Xoài
  //     },
  //     {
  //       label: 'Last year',
  //       backgroundColor: colors.grey[200],
  //       data: dataProp.Dừa
  //     }
  //   ],
  //   labels
  // };

  const options = {
    elements: {
      line: {
        tension: 0 // disables bezier curves
      }
    },
    responsive: true,

    maintainAspectRatio: false,
    animation: false,
    // cornerRadius: 20,
    legend: {
      display: true,
      position: 'right'
    },
    layout: {
      padding: 0
    },
    scales: {
      xAxes: [
        {
          // barThickness: 120,
          // maxBarThickness: 100,
          barPercentage: 0.5,
          categoryPercentage: 0.2,
          gridLines: {
            display: true,
            drawBorder: true
          },
          ticks: {
            padding: 20,
            fontColor: theme.palette.text.secondary
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: true,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            // zeroLineColor: theme.palette.divider
          },
          ticks: {
            padding: 20,
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0,
            maxTicksLimit: 5,
            callback: value => {
              return value > 0 ? value + ' lần' : value;
            }
          }
        }
      ]
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      caretSize: 10,
      yPadding: 20,
      xPadding: 20,
      borderWidth: 1,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.white,
      titleFontColor: theme.palette.text.primary,
      bodyFontColor: theme.palette.text.secondary,
      footerFontColor: theme.palette.text.secondary,
      callbacks: {
        title: () => {},
        label: tooltipItem => {
          let label = `: ${tooltipItem.yLabel}`;

          if (tooltipItem.yLabel > 0) {
            label += 'lần';
          }

          return label;
        }
      }
    }
  };
  const test = params => {
    console.log(dataTest);
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
     
      <Line data={dataTest} options={options} />
    </div>
  );
};

Chart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired
};

export default Chart;
