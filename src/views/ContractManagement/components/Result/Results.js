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
    rejected: colors.red[600]
  };
  const statusName = {
    canceled: colors.grey[600],
    0: 'Đang xử lý',
    1: 'Hoạt động',
    3: 'Chờ xác nhận'
  };

  const handleEditClick = contract => {
    onEditEvent(contract);
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {contracts.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Không tìm thấy hợp đồng mua mua bán cây nào !"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {contracts.length} kết quả được tìm thấy. Trang {page + 1} trên{' '}
        {Math.ceil(contracts.length / rowsPerPage)}
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
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomers.length === contracts.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < contracts.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>STT</TableCell>
                    <TableCell>Số hợp đồng</TableCell>
                    <TableCell>Tên khách hàng</TableCell>
                    <TableCell>Mã cây</TableCell>
                    <TableCell>Số năm thuê</TableCell>
                    <TableCell>Tổng tiền</TableCell>
                    <TableCell>Thời gian</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    {/* <TableCell>Type</TableCell>
                    <TableCell>Projects held</TableCell>
                    <TableCell>Reviews</TableCell> */}
                    <TableCell align="center">Thao tác</TableCell>
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
                        <TableCell padding="checkbox">
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
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{contract.contractNumber}</TableCell>
                        <TableCell>{contract.fullname}</TableCell>
                        <TableCell>{contract.treeCode}</TableCell>
                        <TableCell>{contract.numOfYear}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('vi-VN').format(
                            contract.totalPrice
                          )}
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
                            to={`/contract/${contract.id}/${contract.customerUsername}`}
                            variant="contained">
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            Xem
                          </Button>
                          {contract.status === 0 ? (
                            <Button
                              color="secondary"
                              onClick={handleEditClick.bind(this, contract)}
                              size="small"
                              variant="contained">
                              Sửa
                            </Button>
                          ) : null}
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
