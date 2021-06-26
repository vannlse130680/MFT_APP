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
import { Alert, GenericMoreButton, Label, TableEditBar } from 'components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';


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
  const { className, schedules, onEditEvent, resetPage, ...rest } = props;
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
      ? schedules.map(garden => garden.id)
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
    2: colors.orange[600],
    1: colors.green[600],
    rejected: colors.red[600]
  };

  const handleEditClick = plantType => {
    onEditEvent(plantType);
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {schedules.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Không tìm thấy thông tin vận chuyển nào !"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {schedules.length} kết quả được tìm thấy. Trang {page + 1} trên{' '}
        {Math.ceil(schedules.length / rowsPerPage)}
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
                    <TableCell>Người gửi</TableCell>
                    <TableCell>Vườn</TableCell>
                    <TableCell>Loại trái cây</TableCell>
                    <TableCell>Só lượng</TableCell>
                    <TableCell>Địa chỉ</TableCell>

                    <TableCell>Ngày lấy hàng</TableCell>
                    <TableCell>Trạng thái</TableCell>

                    {/* <TableCell>Type</TableCell>
                    <TableCell>Projects held</TableCell>
                    <TableCell>Reviews</TableCell> */}
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((schedule, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={
                          selectedCustomers.indexOf(schedule.id) !== -1
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
                        <TableCell>{schedule.fullname}</TableCell>
                        <TableCell>{schedule.gardenName}</TableCell>
                        <TableCell>{schedule.plantTypeName}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('vi-VN').format(
                            schedule.yield
                          )}
                        </TableCell>

                        <TableCell>
                          {schedule.address +
                            ', ' +
                            schedule.wardName +
                            ', ' +
                            schedule.districtName +
                            ', ' +
                            schedule.cityName}
                        </TableCell>
                        <TableCell>
                          {moment(schedule.delivery).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          <Label
                            color={statusColors[schedule.status]}
                            variant="contained">
                            {schedule.statusName}
                          </Label>
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            className={classes.actionIcon}
                            color="primary"
                            component={RouterLink}
                            size="small"
                            to={`/transport/update/${schedule.id}`}
                            variant="contained">
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            Xem
                          </Button>
                          <Button
                            color="secondary"
                            size="small"
                            onClick={handleEditClick.bind(this, schedule)}
                            variant="contained">
                            Xác nhận 
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
            count={schedules.length}
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
