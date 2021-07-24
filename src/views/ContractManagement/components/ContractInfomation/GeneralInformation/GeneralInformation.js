import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
  BottomNavigationAction
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  hideLoadingChildren,
  showLoadingChildren
} from 'actions/childrenLoading';
import clsx from 'clsx';
import { Label, Page } from 'components';
import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import { toastError, toastSuccess } from 'utils/toastHelper';
import useRouter from 'utils/useRouter';
import AddEditEvent from './AddEditEvent';
import Header from './Header/Header';
import firebase from '../../../../../firebase/firebase';
import QRCode from 'qrcode.react';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(theme => ({
  root: { padding: theme.spacing(3) },

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
  2: colors.red[600],
  5: colors.lightBlue[600]
};
const statusName = {
  3: 'Chờ xác nhận',
  4: 'Chờ xác nhận hủy',
  0: 'Mới',
  1: 'Hoạt động',
  2: 'Đã hủy',
  5: 'Hoàn thành'
};
const GeneralInformation = props => {
  const {
    className,
    contractInfomation,
    onAccept,
    onConfirmCancel,
    onCancelContract,
    ...rest
  } = props;

  const classes = useStyles();

  const [eventModal, setEventModal] = useState({
    open: false,
    event: null
  });
  const handleModalClose = () => {
    setEventModal({
      open: false,
      event: null
    });
  };
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

  const [openConfirmCancel, setOpenConfirmCancel] = React.useState(false);

  const handleClickOpenConfirmCancel = () => {
    setOpenConfirmCancel(true);
  };

  const handleCloseConfirmCancel = () => {
    setOpenConfirmCancel(false);
  };

  const handleConfirmContract = () => {
    dispatch(showLoadingChildren());

    callAPI(
      `Contract/SendContract/${contractInfomation.contractID}`,
      'PUT',
      null
    )
      .then(res => {
        if (res.data) {
          toastSuccess('Gửi hợp đồng thành công !');
          dispatch(hideLoadingChildren());
          handleClose();
          onAccept();
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: contractInfomation.customerUsername,
            isSeen: false,
            title:
              'Hợp đồng số ' +
              contractInfomation.contractNumber +
              ' đã được cập nhật.',
            type: 'contract',
            created: moment().toISOString()
          };
          dbCon.push(noti);
        } else {
          dispatch(hideLoadingChildren());
          toastError('Gửi hợp đồng không thành công !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleClickCancel = () => {
    setEventModal({
      open: true,
      event: {}
    });
  };
  const handleClickConfirmCancel = () => {
    handleClickOpenConfirmCancel();
  };
  const handleConfirmCancelContract = () => {
    dispatch(showLoadingChildren());

    callAPI(
      `Contract/confirmCancelContract/${contractInfomation.contractID}`,
      'PUT',
      null
    )
      .then(res => {
        if (res.data) {
          toastSuccess('Xác nhận thành công !');
          dispatch(hideLoadingChildren());
          handleCloseConfirmCancel();
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: contractInfomation.customerUsername,
            isSeen: false,
            title:
              'Hợp đồng số ' +
              contractInfomation.contractNumber +
              ' của bạn đã được xác nhận hủy.',
            type: 'contract',
            created: moment().toISOString()
          };
          dbCon.push(noti);
          onConfirmCancel();
        } else {
          dispatch(hideLoadingChildren());
          toastError('Xác nhận không thành công !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleCancelContract = data => {
    callAPI('Contract/cancelContract', 'PUT', data)
      .then(res => {
        if (res.data) {
          toastSuccess('Xác nhận thành công !');
          dispatch(hideLoadingChildren());
          handleModalClose();
          let dbCon = firebase.database().ref('/notificationApp/');
          var noti = {
            customer: contractInfomation.customerUsername,
            isSeen: false,
            title:
              'Nông dân đã gửi yêu cầu hủy hợp đồng số ' +
              contractInfomation.contractNumber +
              ' của bạn.',
            type: 'contract',
            created: moment().toISOString()
          };
          dbCon.push(noti);
          onCancelContract();
        } else {
          dispatch(hideLoadingChildren());
          toastError('Xác nhận không thành công !');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const downloadQRCode = () => {
    const qrCodeURL = document
      .getElementById('qrCodeEl')
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    console.log(qrCodeURL);
    let aEl = document.createElement('a');
    aEl.href = qrCodeURL;
    aEl.download = 'QR_Code.png';
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };
  return (
    <Page className={classes.root}>
      <Header className={classes.header} />
      <Grid
        {...rest}
        className={clsx(classes.root, className)}
        container
        spacing={2}>
        <Grid item lg={10} md={6} xl={4} xs={12}>
          <Card>
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
                  {contractInfomation.status === 1 ||
                  contractInfomation.status === 2 ||
                  contractInfomation.status === 4 ||
                  contractInfomation.status === 5 ? (
                    <TableRow>
                      <TableCell selected style={{ fontWeight: 'bold' }}>
                        Giá trị hợp đồng hiện tại:
                      </TableCell>
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
                    onClick={handleClickOpen}
                    variant="contained">
                    Gửi khách hàng
                  </Button>
                ) : null}

                {contractInfomation.status === 1 ? (
                  <Button
                    className={classes.redButton}
                    onClick={handleClickCancel}
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
                    <TableCell>Ngày hủy:</TableCell>
                    <TableCell>
                      {moment(contractInfomation.cancelDate).format(
                        'DD/MM/YYYY'
                      ) === '01/01/0001'
                        ? null
                        : moment(contractInfomation.cancelDate).format(
                            'DD/MM/YYYY'
                          )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bên hủy:</TableCell>
                    <TableCell align="left">
                      {contractInfomation.cancelPartyName}
                    </TableCell>
                  </TableRow>
                  <TableRow selected>
                    <TableCell>Nguyên nhân:</TableCell>
                    <TableCell>{contractInfomation.cancelReason}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tiền hoàn trả:</TableCell>
                    <TableCell>
                      {' '}
                      {new Intl.NumberFormat('vi-VN').format(
                        contractInfomation.refund
                      )}{' '}
                      VNĐ
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <CardActions>
                {contractInfomation.status === 4 &&
                contractInfomation.cancelParty ===
                  contractInfomation.customerUsername ? (
                  <Button
                    className={classes.redButton}
                    onClick={handleClickConfirmCancel}
                    variant="contained"
                    variant="contained">
                    Xác nhận hủy hợp đồng
                  </Button>
                ) : null}
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
        <Dialog
          aria-describedby="alert-dialog-description"
          aria-labelledby="alert-dialog-title"
          onClose={handleClose}
          open={open}>
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
            <Button autoFocus color="primary" onClick={handleConfirmContract}>
              Đồng ý
            </Button>
          </DialogActions>
          <GoblaLoadingChildren />
        </Dialog>

        <Dialog
          aria-describedby="alert-dialog-description"
          aria-labelledby="alert-dialog-title"
          onClose={handleCloseConfirmCancel}
          open={openConfirmCancel}>
          <DialogTitle id="alert-dialog-title">
            {''} <p style={{ fontSize: 18 }}>Xác nhận hủy hợp đồng</p>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn xác nhận yêu cầu hủy hợp đồng của khách hàng
              !
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmCancel}>Hủy bỏ</Button>
            <Button
              autoFocus
              color="primary"
              onClick={handleConfirmCancelContract}>
              Đồng ý
            </Button>
          </DialogActions>
          <GoblaLoadingChildren />
        </Dialog>
        <Modal onClose={handleModalClose} open={eventModal.open}>
          <AddEditEvent
            event={eventModal.event}
            onCancel={handleModalClose}
            onCancelContract={handleCancelContract}
            selectedContract={contractInfomation}
          />
        </Modal>
        <Grid item lg={4} md={6} xl={4} xs={12}>
          <Card>
            <CardHeader title="Mã QR code" />
            <Divider />
            <CardContent className={classes.content}>
              {' '}
              <QRCode
                id="qrCodeEl"
                size={250}
                value={contractInfomation.contractNumber ? 'contract/' + contractInfomation.contractNumber : ''}
              />
              <Button
             
                size="small"
                
                style={{ marginTop: 20 }}
                onClick={downloadQRCode}>
                <GetAppIcon /> Tải QR code{' '}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default GeneralInformation;
