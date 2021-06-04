import React, { useState } from 'react';
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
  colors
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import PersonIcon from '@material-ui/icons/PersonOutline';

import { Label } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
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
  }
}));

const PlantTypeInformation = props => {
  const { customer, className, ...rest } = props;
  console.log(props);
  const classes = useStyles();

  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  return (
    <Card
      style={{ width: 500, marginTop: 50 }}
      {...rest}
      className={clsx(classes.root, className)}>
      <CardHeader title="Thông tin loại cây" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Phân loại</TableCell>
              <TableCell>
                ádasdad
                {/* <div>
                  <Label
                    color={
                      customer.verified ? colors.green[600] : colors.orange[600]
                    }
                  >
                    {customer.verified
                      ? 'Email verified'
                      : 'Email not verified'}
                  </Label>
                </div> */}
              </TableCell>
            </TableRow>
            <TableRow
              // style={{
              //   whiteSpace: 'normal',
              //   wordWrap: 'break-word'
              // }}
              selected>
              <TableCell>Tên</TableCell>
              <TableCell>
                ádasd aádas dasdasd asdasda sdads asd adasd ádasdas dasdasd asda sda sdadas das dads
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Năng suất</TableCell>
              <TableCell>{customer.state}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Mùa vụ</TableCell>
              <TableCell>{customer.country}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Nhà cung cấp</TableCell>
              <TableCell>{customer.address2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Giá</TableCell>
              <TableCell>{customer.address1}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Trạng thái</TableCell>
              <TableCell>{customer.address2}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button onClick={handleEditOpen}>
          <EditIcon className={classes.buttonIcon} />
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlantTypeInformation;
