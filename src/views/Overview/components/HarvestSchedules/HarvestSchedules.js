import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Button,
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Card,
  CardHeader,
  Divider,
  CardContent
} from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import axios from 'utils/axios';
import { Alert, ProjectCard } from 'components';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  },
  title: {
    position: 'relative',
    '&:before': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      content: '" "',
      height: 3,
      width: 48,
      backgroundColor: theme.palette.primary.main
    }
  },
  arrowIcon: {
    marginLeft: theme.spacing(1)
  }
}));

const HarvestSchedules = props => {
  const { className, harvestSchedule, ...rest } = props;

  const classes = useStyles();
  const [projects, setProjects] = useState([]);

  // useEffect(() => {
  //   let mounted = true;

  //   const fetchProjects = () => {
  //     axios.get('/api/account/projects').then(response => {
  //       if (mounted) {
  //         setProjects(response.data.projects);
  //       }
  //     });
  //   };

  //   fetchProjects();

  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.header}>
        <Typography className={classes.title} variant="h5">
          Cây chuẩn bị thu hoạch
        </Typography>
        <Button component={RouterLink} to="/calendar/harvest">
          Hiển thị trên lịch
          <KeyboardArrowRightIcon className={classes.arrowIcon} />
        </Button>
      </div>
      {/* {contracts.map(project => (
        <ProjectCard
          key={project.id}
          // project={project}
        />
      ))} */}
      <Card>
        <CardHeader title="Danh sách" />
        <Divider />
        <CardContent className={classes.content}>
          <div className={classes.inner}>
            {harvestSchedule.length < 1 ? (
              <Alert
                className={classes.alert}
                message="Bạn không có lịch thu hoạch nào sắp tới !"
              />
            ) : null}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>

                  <TableCell>Mã cây</TableCell>
                  <TableCell>Sản lượng dự kiến</TableCell>
                  <TableCell>Ngày thu hoạch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {harvestSchedule.map((contract, index) => (
                  <TableRow hover key={index}>
                    {/* <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedCustomers.indexOf(garden.id) !== -1
                            }
                            color="primary"
                            onChange={event =>
                              handleSelectOne(event, garden.id)
                            }
                            value={selectedCustomers.indexOf(garden.id) !== -1}
                          />
                        </TableCell> */}
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{contract.treeCode}</TableCell>
                    <TableCell>{contract.yield}</TableCell>
                    <TableCell>
                      {moment(contract.deliveryDate).format('DD/MM/YYYY')}
                    </TableCell>

                    {/* 
                    <TableCell align="center">
                      <Button
                        className={classes.actionIcon}
                        color="primary"
                        component={RouterLink}
                        size="small"
                        to={`/contract/${contract.contractID}`}
                        variant="contained">
                        {' '}
                      
                        Xem
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HarvestSchedules;
