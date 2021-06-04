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
import { useSelector } from 'react-redux';

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
  const gardenInfor = useSelector(state => state.gardenInfor);
  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };
  //   const a = gardenInfor.pt
  // console.log(a.plantTypeName)
  return (
    <Card
      style={{ width: 600, marginTop: 20 }}
      {...rest}
      className={clsx(classes.root, className)}>
      <CardHeader title="Thông tin loại cây" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Phân loại:</TableCell>
              <TableCell>
                {gardenInfor.tt.typeName}
                
              </TableCell>
            </TableRow>
            <TableRow
              // style={{
              //   whiteSpace: 'normal',
              //   wordWrap: 'break-word'
              // }}
              selected>
              <TableCell>Tên:</TableCell>
              <TableCell>{gardenInfor.pt.plantTypeName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Năng suất bình quân:</TableCell>
              <TableCell>{gardenInfor.pt.yield}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Số vụ/năm:</TableCell>
              <TableCell>{gardenInfor.pt.crops}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nhà cung cấp:</TableCell>
              <TableCell>{gardenInfor.pt.supplier} </TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Giá:</TableCell>
              <TableCell>{gardenInfor.pt.price} VNĐ</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Trạng thái:</TableCell>
              <TableCell>
                <div>
                  <Label
                    color={
                      gardenInfor.pt.status === 1
                        ? colors.green[600]
                        : colors.orange[600]
                    }>
                    {gardenInfor.pt.status === 1 ? 'Hoạt động' : 'Tạm ngừng'}
                  </Label>
                </div>
              </TableCell>
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
