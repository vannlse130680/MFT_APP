import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import ViewIcon from '@material-ui/icons/VisibilityOutlined';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  colors
} from '@material-ui/core';

import { Alert, GenericMoreButton, Label, TableEditBar } from 'components';
import TreeHeader from 'views/GardenDetailManagement/Header/TreeHeader';
import moment from 'moment';
import useRouter from 'utils/useRouter';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
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
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  alert: {
    marginTop: 50,
    marginBottom: 10
  }
}));

const Results = props => {
  const { className, trees, onEditEvent, onCopy, ...rest } = props;
  const router = useRouter();

  console.log(trees);
  const classes = useStyles();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = event => {
    const selectedCustomers = event.target.checked
      ? trees.map(garden => garden.id)
      : [];

    setSelectedCustomers(selectedCustomers);
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
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const statusColors = {
    3: colors.grey[600],
    0: colors.orange[600],
    1: colors.green[600],
    2: colors.red[600]
  };
  const statusName = {
    0: 'T???m ng???ng',
    1: 'Ho???t ?????ng',
    2: '???? cho thu??',
    3: '??ang giao d???ch'
  };

  const handleEditClick = tree => {
    onEditEvent(tree);
  };
  const handleCopyClick = (tree) => {
    onCopy(tree)
  }
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {trees.length < 1 ? (
        <Alert
          className={classes.alert}
          message="Kh??ng t??m th???y c??y n??o ! Nh???p v??o th??m m???i ????? b???t ?????u qu???n l?? !"
        />
      ) : null}
      <Typography color="textSecondary" gutterBottom variant="body2">
        {trees.length} k???t qu??? ???????c t??m th???y. Trang {page + 1} tr??n{' '}
        {Math.ceil(trees.length / rowsPerPage)}
      </Typography>
      <Card>
        <CardHeader title="Danh s??ch" />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomers.length === trees.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < trees.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell> */}
                    <TableCell>STT</TableCell>
                    <TableCell>H??nh ?????i di???n</TableCell>
                    <TableCell>M??</TableCell>
                    <TableCell>Gi?? thu??(/n??m)</TableCell>
                    <TableCell>Ti??u chu???n</TableCell>
                    <TableCell>Ng??y t???o</TableCell>
                    <TableCell>Tr???ng th??i</TableCell>
                    {/* <TableCell>Type</TableCell>
                    <TableCell>Projects held</TableCell>
                    <TableCell>Reviews</TableCell> */}
                    <TableCell align="center">Thao t??c</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((tree, index) => (
                      <TableRow
                        hover
                        key={index}
                        selected={selectedCustomers.indexOf(tree.id) !== -1}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedCustomers.indexOf(tree.id) !== -1}
                            color="primary"
                            onChange={event => handleSelectOne(event, tree.id)}
                            value={selectedCustomers.indexOf(tree.id) !== -1}
                          />
                        </TableCell> */}
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <img
                            style={{
                              width: '120px',
                              height: '150px',
                              position: 'relative',
                              display: 'inline-block',
                              overflow: 'hidden',
                              margin: 0
                            }}
                            src={
                              tree.image
                                ? tree.image
                                : '/images/treeDefault.png'
                            }
                          />
                        </TableCell>
                        <TableCell>{tree.treeCode}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('vi-VN').format(tree.price)}
                        </TableCell>
                        <TableCell>{tree.standard}</TableCell>
                        <TableCell>
                          {moment(tree.addDate).format('DD/MM/YYYY')}
                        </TableCell>

                        <TableCell>
                          <Label
                            color={statusColors[tree.status]}
                            variant="contained">
                            {statusName[tree.status]}
                          </Label>
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            className={classes.actionIcon}
                            color="primary"
                            component={RouterLink}
                            size="small"
                            to={`/tree/${tree.id}`}
                            variant="contained">
                            {' '}
                            {/* <ViewIcon className={classes.buttonIcon} /> */}
                            Xem
                          </Button>

                          <Button
                            color="secondary"
                            className={classes.actionIcon}
                            onClick={handleEditClick.bind(this, tree)}
                            size="small"
                            variant="contained">
                            {' '}
                            {/* <EditIcon className={classes.buttonIcon} /> */}
                            C???p nh???t
                          </Button>
                          <Button
                            color="secondary"
                            onClick={handleCopyClick.bind(this, tree)}
                            size="small"
                            variant="contained">
                            {' '}
                            {/* <EditIcon className={classes.buttonIcon} /> */}
                            Sao ch??p
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
            count={trees.length}
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

Results.propTypes = {
  className: PropTypes.string,
  gardens: PropTypes.array
};

Results.defaultProps = {
  gardens: []
};

export default Results;
