import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader, colors,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/styles';
import { hideLoading, showLoading } from 'actions/loading';
import { Alert, AuthGuard, Label, Page } from 'components';
import moment from 'moment';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import callAPI from 'utils/callAPI';
import Header from 'views/GardenDetailManagement/Header/Header';
import TreeDetailHeader from './TreeDetailHeader/TreeDetailHeader';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  results: {
    marginTop: theme.spacing(3)
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlgin: 'center'
  },
  parentGird: {
    marginTop: 10
  },
  alert: {
    marginTop: 10
  }
}));
const statusColors = {
  canceled: colors.grey[600],
  0: colors.orange[600],
  1: colors.green[600],
  2: colors.red[600]
};
const statusName = {
  canceled: colors.grey[600],
  0: 'Tạm ngừng',
  1: 'Hoạt động',
  2: 'Đã bán',
  3: 'Đang giao dịch'
};
const TreePageDetail = props => {
  const { match, history } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { treeId } = match.params;
  console.log(match);
  const [selectedTree, setSelectedTree] = useState({});

  useEffect(() => {
    dispatch(showLoading());
    callAPI(`Tree/getTreeByTreeId/${treeId}`)
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());

          console.log(res.data);
          setSelectedTree(res.data[0]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
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
    <Page className={classes.root} title="Quản lý vườn">
      <AuthGuard roles={['Nông dân']} />
      <Header />
      <Divider />
      <TreeDetailHeader
        gardenId={selectedTree.gardenID}
        style={{ marginTop: 20 }}
      />
      <Alert
        className={classes.alert}
        message="Để cập nhật thông tin cây, bạn cần về quản lí danh sách cây !"
      />
      <Grid container spacing={3} className={classes.parentGird}>
        <Grid item lg={4} md={6} xl={3} xs={12}>
          <Card>
            <CardContent className={classes.content}>
              {' '}
              <img
                style={{ width: 350, height: 500 }}
                src={
                  selectedTree.image
                    ? selectedTree.image
                    : '/images/treeDefault.png'
                }
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={8} md={4} xl={6} xs={12}>
          <Card style={{ width: 800 }}>
            <CardHeader title="Thông tin chi tiết cây" />
            <Divider />
            <CardContent style={{ padding: 0 }}>
              <Table>
                <TableBody>
                  <TableRow selected>
                    <TableCell style={{ width: 200 }}>Mã</TableCell>
                    <TableCell>{selectedTree.treeCode}</TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell>Ngày Tạo</TableCell>
                    <TableCell>
                      {moment(selectedTree.addDate).format('DD/MM/YYYY')}
                    </TableCell>
                  </TableRow>
                  <TableRow selected>
                    <TableCell>Tiêu chuẩn</TableCell>
                    <TableCell>{selectedTree.standard}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>{selectedTree.description}</TableCell>
                  </TableRow>
                  <TableRow selected>
                    <TableCell>Giá:</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN').format(
                        selectedTree.price
                      )}{' '}
                      VNĐ
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Trạng thái:</TableCell>
                    <TableCell>
                      <div>
                        <Label color={statusColors[selectedTree.status]}>
                          {statusName[selectedTree.status]}
                        </Label>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <div className={classes.nameCell}>
                        <div>
                          <Button
                            component={RouterLink}
                            to={`/gardenManagement/garden/${selectedTree.gardenID}/information`}>
                            Xem chi tiết vườn
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardActions className={classes.actions}>
              {/* <Button component={RouterLink} to="/plantType">
                <ArrowBackIcon />
                Về quản lý loại cây trồng
              </Button> */}
            </CardActions>
          </Card>
        </Grid>
        <Grid item lg={4} md={6} xl={3} xs={12}>
          <Card>
          <CardHeader title="Mã QR code" />
          <Divider/>
            <CardContent className={classes.content}>
              {' '}
              <QRCode
                id="qrCodeEl"
                size={250}
                value={selectedTree.treeCode ? 'tree/' + selectedTree.treeCode : ''}
              />
              <Button
                
                size='small'
                
                style={{marginTop: 20}}
                onClick={downloadQRCode}
              ><GetAppIcon/> Tải QR code </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default TreePageDetail;
