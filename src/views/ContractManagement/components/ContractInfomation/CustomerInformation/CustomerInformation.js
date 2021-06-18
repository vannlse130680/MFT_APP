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
  Avatar,
  Typography
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

const useStyles = makeStyles(theme => ({
  root: { marginTop: 10 },
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlgin: 'center',
    padding: 20
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

const CustomerInformation = props => {
  const {customerUsername, className, ...rest } = props;
console.log(customerUsername)
  const classes = useStyles();

  const router = useRouter();
  const [customerInfomation, setCustomerInformation] = useState({});
  console.log(router);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());
    callAPI(`account/${customerUsername}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          dispatch(hideLoading());
          setCustomerInformation(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [customerUsername]);
  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={2}>
      <Grid item lg={2} md={6} xl={2} xs={12}>
        <Card>
          <CardContent className={classes.content}>
            <Avatar
              className={classes.avatar}
              src={customerInfomation.avatar}></Avatar>
            <Typography style={{marginTop : 10}} gutterBottom variant="body1">
            Ảnh đại diện
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={10} md={6} xl={5} xs={12}>
        <Card
        // style={{ width: 600, marginTop: 20 }}
        // {...rest}
        >
          <CardHeader title="Thông tin khách hàng" />
          <Divider />
          <CardContent style={{padding : 0}}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Họ và tên:</TableCell>
                  <TableCell align="left">
                    {customerInfomation.fullname}
                  </TableCell>
                </TableRow>
                <TableRow
                  // style={{
                  //   whiteSpace: 'normal',
                  //   wordWrap: 'break-word'
                  // }}
                  selected>
                  <TableCell>Giới tính:</TableCell>
                  <TableCell>
                    {customerInfomation.gender === 1 ? 'Nam' : 'Nữ'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ngày sinh:</TableCell>
                  <TableCell>
                    {moment(customerInfomation.dateOfBirth).format(
                      'DD/MM/YYYY'
                    )}
                  </TableCell>
                </TableRow>
                <TableRow selected>
                  <TableCell>Số điện thoại:</TableCell>
                  <TableCell>{customerInfomation.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Địa chỉ Email:</TableCell>
                  <TableCell>{customerInfomation.email}</TableCell>
                </TableRow>
                <TableRow selected>
                  <TableCell>Địa chỉ:</TableCell>
                  <TableCell>{customerInfomation.address}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>Trạng thái:</TableCell>
                  <TableCell>
                    <div>
                      <Label
                        color={
                          gardenInfor.pt.status === 1
                            ? colors.green[600]
                            : colors.orange[600]
                        }>
                        {gardenInfor.pt.status === 1
                          ? 'Hoạt động'
                          : 'Tạm ngừng'}
                      </Label>
                    </div>
                  </TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomerInformation;
