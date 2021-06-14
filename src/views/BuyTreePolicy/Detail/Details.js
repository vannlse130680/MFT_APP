import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  colors
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: theme.spacing(6)
  },
  marginTop: {
    marginTop: theme.spacing(4)
  },
  dates: {
    padding: theme.spacing(2),
    backgroundColor: colors.grey[100]
  }
}));

const Details = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <div className={classes.marginTop}>
          <Typography component="h4" gutterBottom variant="h4">
            Giá thuê cây
          </Typography>
          <Typography>
            Giá thuê cây của hợp đồng đã bảo gồm tiền vận chuyển nông sản đến
            khách hàng. Khánh hàng không cần phải chi trả gì thêm.
          </Typography>
        </div>

        <div className={classes.marginTop}>
          <Typography component="h4" gutterBottom variant="h4">
            Bên nông dân
          </Typography>
          <Typography>
            1. Giao trái cây thu hoạch được cho bên khách hàng đúng số lượng,
            chất lượng, chủng loại, thời điểm, địa điểm như đã thỏa thuận tại
            hợp đồng.
          </Typography>
          <Typography>
            2. Chăm sóc, bảo quản, cập nhật tiến độ của cây cho bên khách hàng
            theo dõi.
          </Typography>
          <Typography>
            3. Bảo đảm đúng số mùa vụ (số mùa vụ của cây x số năm thuê) và số
            lượng trái cây thu hoạch cho bên khách hàng.
          </Typography>
          <Typography>
            4. Trong trường hợp cây được bên khách hàng thuê bị ảnh hưởng bởi
            thời tiết, thiên tai thì bên nông dân có thể hủy hợp đồng.
          </Typography>
        </div>
        <div className={classes.marginTop}>
          <Typography component="h4" gutterBottom variant="h4">
            Bên khách hàng
          </Typography>
          <Typography>
            Đơn phương chấm dứt thực hiện hợp đồng khi số lượng, chất lượng sản
            phẩm thu hoạch không đúng thông tin.
          </Typography>
        </div>

        <div className={classes.marginTop}>
          <Typography component="h1" gutterBottom variant="h4">
            Trách nhiệm do vi phạm hợp đồng
          </Typography>
          <Typography>
            Bồi thường thiệt hại: Bên vi phạm nghĩa vụ phải bồi thường thiệt hại
            theo 25 phần trăm theo giá trị hợp đồng đã thỏa thuận. Trong đó phải
            trừ hao những mùa vụ đã giao cho bên khách hàng, chỉ hoàn trả lại
            giá tiền tình theo số mùa vụ chưa giao cho bên khách hàng.
          </Typography>
        </div>

        <div className={classes.marginTop}>
          <Typography component="h4" gutterBottom variant="h4">
            Chi phí khác
          </Typography>
          <Typography>
            Trong trường hợp có trao đổi sản phẩm giữa bên khách hàng với bên
            thứ 3 thì bên khách hàng sẽ chịu mọi phí phát sinh thêm.
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default Details;
