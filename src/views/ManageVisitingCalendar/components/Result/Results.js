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
  alert: {
    marginBottom: 10
  },
  inner: {
    minWidth: 700
  },
  actionIcon: {
    marginRight: theme.spacing(1)
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
  }
}));

const Results = props => {
  const { className, plantTypes, onReject, resetPage,onAccept, ...rest } = props;
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
      ? plantTypes.map(garden => garden.id)
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

  const handleRejectClick = data => {
    onReject(data);
  };

  const handleClickAccept = data => {
    onAccept(data);
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {plantTypes.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Không tìm thấy yêu cầu thăm vườn nào !"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {plantTypes.length} kết quả được tìm thấy. Trang {page + 1} trên{' '}
        {Math.ceil(plantTypes.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader title="Danh sách" />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Tên vườn</TableCell>
                    <TableCell>Ngày thăm</TableCell>
                    <TableCell>Trạng thái</TableCell>

                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plantTypes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((plantType, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={
                          selectedCustomers.indexOf(plantType.id) !== -1
                        }>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{plantType.fullname}</TableCell>

                        <TableCell>{plantType.gardenName}</TableCell>
                        <TableCell>
                          {moment(plantType.visitDate).format(
                            'hh:mm | DD/MM/YYYY '
                          )}
                        </TableCell>

                        <TableCell>
                          <Label
                            color={statusColors[plantType.status]}
                            variant="contained">
                            {plantType.statusName}
                          </Label>
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            className={classes.actionIcon}
                            color="secondary"
                            size="small"
                            variant="contained"
                            disabled={plantType.status === 1}
                            onClick={handleClickAccept.bind(
                              this,
                              plantType
                            )}>
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            Xác nhận
                          </Button>
                          <Button
                            className={classes.redButton}
                            size="small"
                            onClick={handleRejectClick.bind(this, plantType)}
                            disabled={plantType.status === 1}
                            variant="contained">
                            Từ chối
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
            count={plantTypes.length}
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
  plantTypes: PropTypes.array.isRequired
};

Results.defaultProps = {
  plantTypes: []
};

export default Results;
