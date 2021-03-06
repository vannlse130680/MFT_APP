import {
  Button, Card,
  CardActions,
  CardContent,
  CardHeader, colors, Divider, Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Alert, GenericMoreButton, TableEditBar } from 'components';
import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';



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
  const { className, districts, onEditEvent, onBan,cityId, ...rest } = props;

  const classes = useStyles();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = event => {
    const selectedCustomers = event.target.checked
      ? districts.map(garden => garden.id)
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
      {districts.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Kh??ng t??m th???y Qu???n ho???c Huy???n n??o !"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {districts.length} k???t qu??? ???????c t??m th???y. Trang {page + 1} tr??n{' '}
        {Math.ceil(districts.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader action={<GenericMoreButton />} title="Danh s??ch" />
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

                    <TableCell>T??n</TableCell>

                    <TableCell align="center">Thao t??c</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {districts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((district, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={selectedCustomers.indexOf(district.id) !== -1}>
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

                        <TableCell>{district.districtName}</TableCell>

                        <TableCell align="center">
                          <Button
                            className={classes.actionIcon}
                            color="primary"
                            component={RouterLink}
                            size="small"
                            to={`/managementAddress/districts/${district.id}/${cityId}`}
                            variant="contained">
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            Qu???n l??
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
            count={districts.length}
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
