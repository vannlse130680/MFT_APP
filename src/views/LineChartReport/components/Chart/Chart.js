import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Bar, Line } from 'react-chartjs-2';
import { makeStyles, useTheme } from '@material-ui/styles';
import { colors } from '@material-ui/core';
import callAPI from 'utils/callAPI';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative'
  }
}));

const Chart = props => {
  const {
    data: dataProp,
    labels,
    className,
    selectedPlantType,
    ...rest
  } = props;

  const classes = useStyles();
  const theme = useTheme();

 
  // useEffect(() => {
  //   var arr = [];
  //   var obj1 = {
  //     fill: false,
  //     borderColor: 'red',
  //     label: 'Bình quân',
  //     backgroundColor: 'red',
  //     data: test
  //   };
  //   // var obj2 = {
  //   //   fill: false,
  //   //   borderColor: color,
  //   //   label: plantType[index].plantTypeName,
  //   //   backgroundColor: color,
  //   //   data: test
  //   // };
  //   arr.push(obj1);
  //   setDataTest({ ...dataTest, datasets: arr });
  // }, [selectedPlantType]);

  const data = {
    datasets: [
      {
        fill: false,
        label: 'Theo kế hoạch',
        backgroundColor:colors.red[200],
        data: dataProp.plan,
        borderColor:colors.red[200]
      },
      {
        label: 'Thực tê',
        fill: false,
        backgroundColor:  theme.palette.primary.main,
        borderColor:theme.palette.primary.main,
        data: dataProp.real
      }
    ],
    labels
  };

  const options = {
    // elements: {
    //   line: {
    //     tension: 0 // disables bezier curves
    //   }
    // },
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
              return value > 0 ? value + ' kg' : value;
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
            label += 'kg';
          }

          return label;
        }
      }
    }
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Line data={data} options={options} />
    </div>
  );
};

Chart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired
};

export default Chart;
