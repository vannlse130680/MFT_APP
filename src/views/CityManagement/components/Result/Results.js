import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import ViewIcon from '@material-ui/icons/VisibilityOutlined';

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
  colors,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent
} from '@material-ui/core';

import { Alert, GenericMoreButton, Label, TableEditBar } from 'components';
import { Avatar } from '@material-ui/core';
import callAPI from 'utils/callAPI';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  redButton: {
    color: theme.palette.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    }
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
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  alert: {
    marginBottom: 10
  }
}));

const Results = props => {
  const { className, cities, onEditEvent, onBan, ...rest } = props;

  const classes = useStyles();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = event => {
    const selectedCustomers = event.target.checked
      ? cities.map(garden => garden.id)
      : [];

    setSelectedCustomers(selectedCustomers);
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
    2: colors.orange[600],
    1: colors.green[600],
    0: colors.red[600]
  };

  // const handleEditClick = garden => {
  //   onEditEvent(garden);
  // };
  const handleBanAccount = customer => {
    onBan(customer);
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {cities.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Không tìm thấy Tỉnh hoặc Thành Phố nào !"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {cities.length} kết quả được tìm thấy. Trang {page + 1} trên{' '}
        {Math.ceil(cities.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader action={<GenericMoreButton />} title="Danh sách" />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomers.length === accounts.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < accounts.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell> */}
                    <TableCell>STT</TableCell>

                    <TableCell>Tên</TableCell>

                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cities
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((city, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={selectedCustomers.indexOf(city.id) !== -1}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedCustomers.indexOf(account.id) !== -1
                            }
                            color="primary"
                            onChange={event =>
                              handleSelectOne(event, account.id)
                            }
                            value={
                              selectedCustomers.indexOf(account.id) !== -1
                            }
                          />
                        </TableCell> */}
                        <TableCell>{index + 1}</TableCell>

                        <TableCell>{city.cityName}</TableCell>

                        <TableCell align="center">
                          <Button
                            className={classes.actionIcon}
                            color="primary"
                            component={RouterLink}
                            size="small"
                            to={`/managementAddress/cities/${city.id}`}
                            variant="contained">
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            Quản lý
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
            count={cities.length}
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
