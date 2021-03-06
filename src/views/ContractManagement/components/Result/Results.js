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
  const { className, onEditEvent, contracts, ...rest } = props;

  const classes = useStyles();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = event => {
    const selectedCustomers = event.target.checked
      ? contracts.map(garden => garden.id)
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
    2: colors.red[600],
    5: colors.lightBlue[600]
  };
  const statusName = {
    2: '???? h???y',
    0: 'M???i',
    1: 'Ho???t ?????ng',
    3: 'Ch??? x??c nh???n',
    4: 'Ch??? x??c nh???n h???y',
    5: 'Ho??n th??nh'
  };

  const handleEditClick = contract => {
    onEditEvent(contract);
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {contracts.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Kh??ng t??m th???y h???p ?????ng mua mua b??n c??y n??o !"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {contracts.length} k???t qu??? ???????c t??m th???y. Trang {page + 1} tr??n{' '}
        {Math.ceil(contracts.length / rowsPerPage)}
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
                        checked={selectedCustomers.length === contracts.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < contracts.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell> */}
                    <TableCell>STT</TableCell>
                    <TableCell>S??? h???p ?????ng</TableCell>
                    <TableCell>T??n kh??ch h??ng</TableCell>
                    <TableCell>M?? c??y</TableCell>
                    <TableCell>Lo???i c??y</TableCell>
                    <TableCell>S??? n??m thu??</TableCell>
                    <TableCell>T???ng ti???n</TableCell>
                    <TableCell>Th???i gian</TableCell>
                    <TableCell>Tr???ng th??i</TableCell>
                    {/* <TableCell>Type</TableCell>
                    <TableCell>Projects held</TableCell>
                    <TableCell>Reviews</TableCell> */}
                    <TableCell align="center">Thao t??c</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((contract, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={
                          selectedCustomers.indexOf(contract.id) !== -1
                        }>
                        {/* <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedCustomers.indexOf(contract.id) !== -1
                            }
                            color="primary"
                            onChange={event =>
                              handleSelectOne(event, contract.id)
                            }
                            value={
                              selectedCustomers.indexOf(contract.id) !== -1
                            }
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
                          )} VN??
                        </TableCell>
                        <TableCell>
                          {moment(contract.date).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          <Label
                            color={statusColors[contract.status]}
                            variant="contained">
                            {statusName[contract.status]}
                          </Label>
                        </TableCell>

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
                            Qu???n l??
                          </Button>

                          <Button
                            color="secondary"
                            onClick={handleEditClick.bind(this, contract)}
                            size="small"
                            variant="contained">
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
            count={contracts.length}
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

