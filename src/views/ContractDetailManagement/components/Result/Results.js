import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  colors,
  Divider,
  Link,
  Table,
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
  const {
    className,
    contractDetails,
    onEditEvent,
    resetPage,
    onAcceptDeliveryDate,
    onAcceptAll,
    contractId,
    onDenyDeliveryDate,
    contractStatus,
    onEditDateEvent,
    onEditYieldEvent,
    ...rest
  } = props;
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
      ? contractDetails.map(garden => garden.id)
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
    0: colors.grey[600],
    1: colors.orange[600],
    2: colors.green[600],
    3: colors.lightBlue[600],
    rejected: colors.red[600]
  };

  const handleEditClick = plantType => {
    onEditEvent(plantType);
  };
  const handleEditDateClick = plantType => {
    onEditDateEvent(plantType);
  };
  const handleEditYieldClick = plantType => {
    onEditYieldEvent(plantType);
  };
  const hanleAcceptDeliveryDate = (id, event) => {
    event.preventDefault();
    console.log(id);
    onAcceptDeliveryDate(id);
  };

  const handleAcceptClick = id => {
    onAcceptAll(id);
  };
  const hanleDenyDeliveryDate = (id, event) => {
    event.preventDefault();
    console.log(id);
    onDenyDeliveryDate(id);
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {contractDetails.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Không tìm thấy chi tiết hợp đồng nào trồng nào!"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {contractDetails.length} kết quả được tìm thấy. Trang {page + 1} trên{' '}
        {Math.ceil(contractDetails.length / rowsPerPage)}
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
                    <TableCell>Ngày có thể thu hoạch</TableCell>

                    <TableCell>Tổng sản lượng</TableCell>

                    <TableCell>Ngày giao</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    {/* <TableCell>Type</TableCell>
                    <TableCell>Projects held</TableCell>
                    <TableCell>Reviews</TableCell> */}
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contractDetails
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((contractDetail, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={
                          selectedCustomers.indexOf(contractDetail.id) !== -1
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
                          {contractDetail.startHarvest ? (
                            <div>
                              {' '}
                              Từ{' '}
                              <span>
                                {moment(contractDetail.startHarvest).format(
                                  'DD/MM/YYYY'
                                )}
                              </span>{' '}
                              đến{' '}
                              <span>
                                {moment(contractDetail.endHarvest).format(
                                  'DD/MM/YYYY'
                                )}
                              </span>
                            </div>
                          ) : (
                            'Chưa cập nhật'
                          )}{' '}
                          {contractDetail.status === 0 &&
                          contractStatus !== 5 ? (
                            <div>
                              {' '}
                              <Link
                                href="#"
                                onClick={handleEditDateClick.bind(
                                  this,
                                  contractDetail
                                )}>
                                Cập nhật
                              </Link>{' '}
                            </div>
                          ) : null}
                        </TableCell>

                        <TableCell>
                          {new Intl.NumberFormat('vi-VN').format(
                            contractDetail.yield
                          )}
                          {(contractDetail.status === 0 ||
                            contractDetail.status === 1) &&
                          contractStatus !== 5 ? (
                            <div>
                              {' '}
                              <Link
                                href="#"
                                onClick={handleEditYieldClick.bind(
                                  this,
                                  contractDetail
                                )}>
                                Cập nhật
                              </Link>{' '}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {contractDetail.deliveryDate ? (
                            <div>
                              <div>
                                {' '}
                                {moment(contractDetail.deliveryDate).format(
                                  'DD/MM/YYYY'
                                )}{' '}
                              </div>
                              <div>
                                {contractDetail.status === 0 ? (
                                  <div>
                                    {contractStatus !== 5 ? (
                                      <div>
                                        {' '}
                                        <Link
                                          href="#"
                                          onClick={hanleAcceptDeliveryDate.bind(
                                            this,
                                            contractDetail.id
                                          )}>
                                          Xác nhận
                                        </Link>{' '}
                                        |{' '}
                                        <Link
                                          // style={{ color: 'red' }}
                                          href="#"
                                          onClick={hanleDenyDeliveryDate.bind(
                                            this,
                                            contractDetail.id
                                          )}>
                                          Từ chối
                                        </Link>
                                      </div>
                                    ) : null}
                                  </div>
                                ) : (
                                  'Đã xác nhận'
                                )}
                              </div>
                            </div>
                          ) : (
                            'Chưa cập nhật'
                          )}
                        </TableCell>

                        <TableCell>
                          <Label
                            color={statusColors[contractDetail.status]}
                            variant="contained">
                            {contractDetail.statusName}
                          </Label>
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            className={classes.actionIcon}
                            color="primary"
                            component={RouterLink}
                            size="small"
                            to={`/contractDetail/${contractId}/${contractDetail.id}`}
                            variant="contained">
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            Xem
                          </Button>
                          {/* <Button
                            className={classes.actionIcon}
                            color="secondary"
                            onClick={handleEditClick.bind(this, contractDetail)}
                            size="small"
                            // disabled={contractStatus === 5}
                            variant="contained">
                            Cập nhật
                          </Button> */}
                          <Button
                            color="secondary"
                            onClick={handleAcceptClick.bind(
                              this,
                              contractDetail.id
                            )}
                            size="small"
                            disabled={
                              contractDetail.status !== 1 ||
                              contractStatus === 5
                            }
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
            count={contractDetails.length}
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
