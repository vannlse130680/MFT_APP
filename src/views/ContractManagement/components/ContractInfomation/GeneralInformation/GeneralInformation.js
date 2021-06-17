import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  colors,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  Link,
  DialogContentText
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import PersonIcon from '@material-ui/icons/PersonOutline';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Label } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import useRouter from 'utils/useRouter';
import callAPI from 'utils/callAPI';
import { hideLoading, showLoading } from 'actions/loading';
import moment from 'moment';
import { toastError, toastSuccess } from 'utils/toastHelper';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import {
  hideLoadingChildren,
  showLoadingChildren
} from 'actions/childrenLoading';

const useStyles = makeStyles(theme => ({
  root: { marginTop: 10 },
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlgin: 'center',
    padding: 20
  },
  redButton: {
    color: theme.palette.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    }
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > * + *': {
      marginLeft: 0
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  avatar: {
    height: 150,
    width: 150
  }
}));
const statusColors = {
  3: colors.grey[600],
  0: colors.orange[600],
  1: colors.green[600],
  rejected: colors.red[600]
};
const statusName = {
  3: 'Chờ xác nhận',
  0: 'Đang xử lý',
  1: 'Hoạt động',
  2: 'Đã hủy'
};
const GeneralInformation = props => {
  const { className, contractInfomation, onAccept, ...rest } = props;

  const classes = useStyles();

  const router = useRouter();
  // const [contractInfomation, setContractInformation] = useState({});
  console.log(router);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // useEffect(() => {
  //   dispatch(showLoading());
  //   callAPI(`Contract/GetContractById/${router.match.params.id}`, 'GET', null)
  //     .then(res => {
  //       if (res.status === 200) {
  //         dispatch(hideLoading());
  //         setContractInformation(res.data[0]);
  //         console.log(res.data);
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, []);
  const handleConfirmContract = () => {
    dispatch(showLoadingChildren());
    // var data = {
    //   treeID: contractInfomation.treeID,
    //   contractID: contractInfomation.id
    // };

    callAPI(`Contract/SendContract/${contractInfomation.id}`, 'PUT', null)
      .then(res => {
        if (res.data) {
          toastSuccess('Gửi hợp đồng thành công !');
          dispatch(hideLoadingChildren());
          handleClose();
          onAccept();
        } else {
          dispatch(hideLoadingChildren());
          toastError('Gửi hợp đồng không thành công !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={2}>
      <Grid item lg={10} md={6} xl={4} xs={12}>
        <Card
        // style={{ width: 600, marginTop: 20 }}
        // {...rest}
        >
          <CardHeader title="Chi tiết hợp đồng" />
          <Divider />
          <CardContent style={{ padding: 0 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Số hợp đồng:</TableCell>
                  <TableCell align="left">
                    {contractInfomation.contractNumber}
                  </TableCell>
                </TableRow>
                <TableRow
                  // style={{
                  //   whiteSpace: 'normal',
                  //   wordWrap: 'break-word'
                  // }}
                  selected>
                  <TableCell>Khách hàng:</TableCell>
                  <TableCell>{contractInfomation.fullname}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mã cây:</TableCell>
                  <TableCell>
                    <div className={classes.nameCell}>
                      <div>
                        <Link
                          color="inherit"
                          component={RouterLink}
                          to={`/tree/${contractInfomation.treeID}`}
                          variant="h6">
                          {contractInfomation.treeCode || ''}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow selected>
                  <TableCell>Giá thuê:</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN').format(
                      contractInfomation.treePrice
                    )}{' '}
                    VNĐ
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Số năm thuê:</TableCell>
                  <TableCell>{contractInfomation.numOfYear}</TableCell>
                </TableRow>

                <TableRow selected>
                  <TableCell>Tổng mùa vụ:</TableCell>
                  <TableCell>{contractInfomation.totalCrop}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tổng sản lượng:</TableCell>
                  <TableCell>{contractInfomation.totalYield}</TableCell>
                </TableRow>
                <TableRow selected>
                  <TableCell>Tiền vận chuyển:</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN').format(
                      contractInfomation.shipFee
                    )}{' '}
                    VNĐ
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Thời gian:</TableCell>
                  <TableCell>
                    {moment(contractInfomation.date).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
                <TableRow selected>
                  <TableCell>Tổng tiền:</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN').format(
                      contractInfomation.totalPrice
                    )}{' '}
                    VNĐ
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Trạng thái:</TableCell>
                  <TableCell>
                    <div>
                      <Label color={statusColors[contractInfomation.status]}>
                        {statusName[contractInfomation.status]}
                      </Label>
                    </div>
                  </TableCell>
                </TableRow>
                {contractInfomation.status === 1 ? (
                  <TableRow >
                    <TableCell selected style={{ fontWeight: 'bold' }}>Giá trị hợp đồng hiện tại:</TableCell>
                    <TableCell selected style={{ fontWeight: 'bold' }}>
                      {new Intl.NumberFormat('vi-VN').format(
                        contractInfomation.contractPrice
                      )}{' '}
                      VNĐ
                    </TableCell>
                  </TableRow>
                ) : null}

                
              </TableBody>
            </Table>
            <CardActions>
              {contractInfomation.status === 0 ? (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleClickOpen}>
                  Gửi khách hàng
                </Button>
              ) : null}

              {contractInfomation.status === 1 ? (
                <Button
                  className={classes.redButton}
                  variant="contained"
                  variant="contained">
                  Hủy hợp đồng
                </Button>
              ) : null}
            </CardActions>
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={2} md={6} xl={4} xs={12}>
        <Card>
          <CardHeader title="Thông tin hủy hợp đồng (nếu có)" />
          <Divider />
          <CardContent style={{ padding: 0 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Bên hủy:</TableCell>
                  <TableCell align="left">
                    {contractInfomation.cancelParty}
                  </TableCell>
                </TableRow>
                <TableRow selected>
                  <TableCell>Nguyên nhân:</TableCell>
                  <TableCell>{contractInfomation.cancelReason}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tiền hoàn trả:</TableCell>
                  <TableCell>{contractInfomation.refund}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {''} <p style={{ fontSize: 18 }}>Gửi hợp đồng</p>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn gửi hợp đồng này cho khác hàng !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button onClick={handleConfirmContract} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
        <GoblaLoadingChildren />
      </Dialog>
    </Grid>
  );
};

export default GeneralInformation;
