import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  colors
} from '@material-ui/core';

import { Alert, GenericMoreButton, Label, TableEditBar } from 'components';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  redButton: {
    marginRight: 10,
    color: theme.palette.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    }
  },
  alert: {
    marginBottom: 10
  },
  inner: {
    minWidth: 700
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

const Results = props => {
  const { className, treeProcesses, onEditEvent, resetPage, onClickDelete, ...rest } = props;
  // console.log(plantTypes);
  const classes = useStyles();
  useEffect(() => {
    if (resetPage) {
      console.log(resetPage);
      setPage(0);
    }
  }, [resetPage]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = event => {
    const selectedCustomers = event.target.checked
      ? treeProcesses.map(garden => garden.id)
      : [];

    setSelectedCustomers(selectedCustomers);
    // console.log(selectedCustomers)
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomers.indexOf(id);
    let newSelectedCustomers = [];

    if (selectedIndex === -1) {
      newSelectedCustomers = newSelectedCustomers.concat(selectedCustomers, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(1)
      );
    } else if (selectedIndex === selectedCustomers.length - 1) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(0, selectedIndex),
        selectedCustomers.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomers(newSelectedCustomers);
    // console.log(selectedCustomers)
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const statusColors = {
    canceled: colors.grey[600],
    0: colors.orange[600],
    1: colors.green[600],
    rejected: colors.red[600]
  };

  const handleEditClick = plantType => {
    onEditEvent(plantType);
  };

  const handleClickDelete = (id) => {
    onClickDelete(id)
  }
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {treeProcesses.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Kh??ng t??m th???y l???ch s??? ch??m s??c c??y n??o"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {treeProcesses.length} k???t qu??? ???????c t??m th???y. Trang {page + 1} tr??n{' '}
        {Math.ceil(treeProcesses.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader title="Danh s??ch" />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomers.length === plantTypes.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < plantTypes.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell> */}
                    <TableCell>STT</TableCell>
                    <TableCell>H??nh ???nh</TableCell>
                    <TableCell>M?? t???</TableCell>
                    <TableCell>Th???i gian</TableCell>

                    {/* <TableCell>Type</TableCell>
                    <TableCell>Projects held</TableCell>
                    <TableCell>Reviews</TableCell> */}
                    <TableCell align="center">Thao t??c</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {treeProcesses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((treeProcess, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={
                          selectedCustomers.indexOf(treeProcess.id) !== -1
                        }>
                        {/* <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedCustomers.indexOf(plantType.id) !== -1
                            }
                            color="primary"
                            onChange={event =>
                              handleSelectOne(event, plantType.id)
                            }
                            value={
                              selectedCustomers.indexOf(plantType.id) !== -1
                            }
                          />
                        </TableCell> */}
                        <TableCell>{index + 1}</TableCell>

                        <TableCell>
                          <img
                            style={{
                              width: '120px',
                              height: '150px',
                              position: 'relative',
                              display: 'inline-block',
                              overflow: 'hidden',
                              margin: 0
                            }}
                            src={
                              treeProcess.processImage
                                ? treeProcess.processImage
                                : '/images/treeDefault.png'
                            }
                          />
                        </TableCell>
                        <TableCell>{treeProcess.description}</TableCell>
                        <TableCell>
                          {moment(treeProcess.date).format('DD/MM/YYYY')}
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            className={classes.redButton}
                            onClick={handleClickDelete.bind(this, treeProcess.id)}
                            size="small"
                            variant="contained">
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            X??a
                          </Button>
                          <Button
                            color="secondary"
                            size="small"
                            onClick={handleEditClick.bind(this, treeProcess)}
                            variant="contained">
                            S???a
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={treeProcesses.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardActions>
      </Card>
      <TableEditBar selected={selectedCustomers} />
    </div>
  );
};

export default Results;
