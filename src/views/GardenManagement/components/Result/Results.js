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
  colors
} from '@material-ui/core';

import { Alert, GenericMoreButton, Label, TableEditBar } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
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
  const { className, gardens, onEditEvent, ...rest } = props;
  console.log(gardens);
  const classes = useStyles();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = event => {
    const selectedCustomers = event.target.checked
      ? gardens.map(garden => garden.id)
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
    0: colors.orange[600],
    1: colors.green[600],
    rejected: colors.red[600]
  };

  const handleEditClick = garden => {
    onEditEvent(garden);
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {gardens.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Kh??ng t??m th???y v?????n c??y n??o ! Nh???p v??o th??m v?????n m???i ????? b???t ?????u qu???n l?? !"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {gardens.length} k???t qu??? ???????c t??m th???y. Trang {page + 1} tr??n{' '}
        {Math.ceil(gardens.length / rowsPerPage)}
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
                        checked={selectedCustomers.length === gardens.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < gardens.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell> */}
                    <TableCell>STT</TableCell>
                    <TableCell>M??</TableCell>
                    <TableCell>T??n</TableCell>
                    <TableCell>Lo???i c??y ???????c tr???ng</TableCell>
                    <TableCell>?????a ch???</TableCell>
                    <TableCell>Ph?? v???n chuy???n</TableCell>
                    <TableCell>Tr???ng th??i</TableCell>
                    {/* <TableCell>Type</TableCell>
                    <TableCell>Projects held</TableCell>
                    <TableCell>Reviews</TableCell> */}
                    <TableCell align="center">Thao t??c</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gardens
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((garden, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={selectedCustomers.indexOf(garden.id) !== -1}>
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
                        <TableCell>{garden.gardenCode}</TableCell>
                        <TableCell>{garden.gardenName}</TableCell>
                        <TableCell>{garden.plantTypeName}</TableCell>
                        <TableCell>
                          {garden.address +
                            ' , ' +
                            garden.wardName +
                            ' , ' +
                            garden.districtName +
                            ' , ' +
                            garden.cityName}
                        </TableCell>
                        <TableCell>
                          {' '}
                          {new Intl.NumberFormat('vi-VN').format(
                            garden.shipFee
                          )} VN??
                        </TableCell>
                        <TableCell>
                          <Label
                            color={statusColors[garden.status]}
                            variant="contained">
                            {garden.statusName}
                          </Label>
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            className={classes.actionIcon}
                            color="primary"
                            component={RouterLink}
                            size="small"
                            to={`/gardenManagement/garden/${garden.id}`}
                            variant="contained">
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            Qu???n l??
                          </Button>
                          <Button
                            color="secondary"
                            onClick={handleEditClick.bind(this, garden)}
                            size="small"
                            variant="contained">
                            {' '}
                            {/* <EditIcon className={classes.buttonIcon} /> */}
                            C???p nh???t
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
            count={gardens.length}
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

Results.propTypes = {
  className: PropTypes.string,
  gardens: PropTypes.array
};

Results.defaultProps = {
  gardens: []
};

export default Results;
