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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
    },
    marginTop : 0
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));

const General = props => {
  const { customer, className, ...rest } = props;

  const classes = useStyles();

  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  return (
    <Card  style={{width : 500, marginTop: 50}}
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="Thông tin vườn" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell  style={{fontWeight : "bold"}} > Mã</TableCell>
              <TableCell  style={{fontWeight : "bold"}}>
                sad
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
            <TableRow selected>
              <TableCell>Tên</TableCell>
              <TableCell>{customer.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>asd asd asd asd á sda asd asd asd asd sad sad asd sd dá ad da ad ad da ad sad </TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Trạng thái</TableCell>
              <TableCell>{customer.country}</TableCell>
            </TableRow>
            
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.actions}>
      
        <Button onClick={handleEditOpen}>
          <EditIcon className={classes.buttonIcon} />
          Chỉnh sửa
        </Button>
        
      </CardActions>
      <CardActions className={classes.actions}>
      
      <Button onClick={handleEditOpen}>
        <EditIcon className={classes.buttonIcon} />
        Chỉnh sửa
      </Button>
      
    </CardActions>
    </Card>
  );
};



export default General;
