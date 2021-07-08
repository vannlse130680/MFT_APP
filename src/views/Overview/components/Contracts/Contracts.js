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

const Contracts = props => {
  const { className, contracts, ...rest } = props;

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
          Hợp đồng mới
        </Typography>
        <Button component={RouterLink} to="/contract">
          Xem tất cả
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
            {contracts.length < 1 ? (
              <Alert
                className={classes.alert}
                message="Bạn không có hợp đồng nào mới !"
              />
            ) : null}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Số hợp đồng</TableCell>
                  <TableCell>Tên khách hàng</TableCell>
                  <TableCell>Mã cây</TableCell>
                  <TableCell>Loại cây</TableCell>
                  <TableCell>Số năm thuê</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Ngày thuê</TableCell>
                  {/* <TableCell>Type</TableCell>
                    <TableCell>Projects held</TableCell>
                    <TableCell>Reviews</TableCell> */}
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.map((contract, index) => (
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
                    <TableCell>{contract.contractNumber}</TableCell>
                    <TableCell>{contract.fullname}</TableCell>
                    <TableCell>{contract.treeCode}</TableCell>
                    <TableCell>{contract.plantTypeName}</TableCell>
                    <TableCell>{contract.numOfYear}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN').format(
                        contract.totalPrice
                      )}
                    </TableCell>

                    <TableCell>{contract.plantTypeName}</TableCell>

                    <TableCell align="center">
                      <Button
                        className={classes.actionIcon}
                        color="primary"
                        component={RouterLink}
                        size="small"
                        to={`/contract/${contract.contractID}`}
                        variant="contained">
                        {' '}
                        {/* <ViewIcon className={classes.buttonIcon} /> */}
                        Xem
                      </Button>
                    </TableCell>
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

export default Contracts;
