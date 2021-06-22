/* eslint-disable react/display-name */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  colors,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { showLoadingChildren } from 'actions/childrenLoading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import callAPI from 'utils/callAPI';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import validate from 'validate.js';

const schema = {
  code: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    format: {
      pattern: '[aA-zZ0-9]+',

      message: 'Mã không được chứa kí tự đặc biệt'
    },
    length: {
      maximum: 10,
      message: 'Tối đa chỉ 10 kí tự'
    }
  },
  name: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  address: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  test: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  city: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  district: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  },
  ward: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  }
};
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  field: {
    marginTop: theme.spacing(3)
  },
  cancelButton: {
    marginLeft: 'auto'
  },
  confirmButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  formControl: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(3),
    minWidth: 150
  }
}));

const AddEditEvent = forwardRef((props, ref) => {
  const {
    event,
    onDelete,
    onCancel,
    onAdd,
    onEdit,
    className,
    selectedGarden,
    ...rest
  } = props;

  const classes = useStyles();

  // const defaultValue = {
  //   name: '111',
  //   address: '111',
  //   plantType: '11'
  // };
  const [plantTypesName, setPlantTypesName] = useState([]);
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formState, setFormState] = useState({
    isValid: false,
    values: { status: 1 },
    touched: {},
    errors: {}
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const errors = validate(formState.values, schema, { fullMessages: false });

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  useEffect(() => {
    var username = JSON.parse(sessionStorage.getItem('USER')).username;
    callAPI(`PlantType/getPlantTypeName/${username}`, 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setPlantTypesName(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
    callAPI('city', 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setCitys(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
    callAPI('District', 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setDistricts(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
    callAPI('ward', 'GET', null)
      .then(res => {
        if (res.status === 200) {
          setWards(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectedGarden)
      setFormState(formState => ({
        ...formState,
        values: {
          name: selectedGarden.gardenName,
          address: selectedGarden.address,
          code: selectedGarden.gardenCode,

          test: 'a',
          auto: selectedGarden.plantTypeObj,
          status: selectedGarden.status,
          city: selectedGarden.city,
          district: selectedGarden.district,
          ward: selectedGarden.ward
        }
      }));
  }, []);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const mode = event ? 'edit' : 'add';

  const handleChange = (event, value) => {
    if (!event) return;

    event.persist();

    if (event.target.name === 'test') {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          test: ''
        },
        touched: {
          ...formState.touched,
          [event.target.name]: true
        }
      }));
    } else if (event.target.name) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [event.target.name]:
            event.target.type === 'checkbox'
              ? event.target.checked
              : event.target.value === ''
              ? null
              : event.target.value
        },
        touched: {
          ...formState.touched,
          [event.target.name]: true
        }
      }));
    } else {
      // console.log('auto');
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          auto: value,
          test: 'ád'
        }
      }));
    }
    if (event.target.name === 'city') {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          district: null,
          ward: null
        }
      }));
    }
    if (event.target.name === 'district') {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,

          ward: null
        }
      }));
    }
  };

  const handleDelete = () => {
    onDelete && onDelete(event);
  };

  const handleAdd = () => {
    dispatch(showLoadingChildren());
    var { values } = formState;
    var username = JSON.parse(sessionStorage.getItem('USER')).username;
    var data = {
      gardenCode: values.code,
      farmerUsername: username,
      gardenName: values.name,
      address: values.address,
      plantTypeID: values.auto.id,
      city: values.city,
      district: values.district,
      ward: values.ward
    };

    console.log(formState.values);
    onAdd(data);
  };

  const handleEdit = () => {
    dispatch(showLoadingChildren());
    var username = JSON.parse(sessionStorage.getItem('USER')).username;
    // console.log(formState.values);
    // console.log(selectedGarden)
    var data = {
      gardenId: selectedGarden.id,
      gardenCode: formState.values.code,
      farmerUsername: username,
      gardenName: formState.values.name,
      address: formState.values.address,
      gardenDetailId: selectedGarden.gardenDetailId,
      plantTypeID: formState.values.auto.id,
      status: formState.values.status,
      city: formState.values.city,
      district: formState.values.district,
      ward: formState.values.ward
    };
    // console.log(data)
    onEdit(data);
  };
  // console.log(selectedPlantType);

  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <GoblaLoadingChildren />
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm vườn' : 'Cập nhật vườn'}
          </Typography>
          <Autocomplete
            // onChange={handleChange}
            // value={selectedPlantType.t}
            // disableClearable="true"
            defaultValue={selectedGarden ? selectedGarden.plantTypeObj : null}
            // inputValue={formState.values.test}
            getOptionLabel={option => option.plantTypeName}
            // value={formState.values.test}
            getOptionSelected={(option, value) => option.id === value.id}
            onChange={(event, value) => handleChange(event, value)}
            onInputChange={handleChange} // prints the selected value
            options={plantTypesName}
            renderInput={params => (
              <TextField
                {...params}
                className={classes.field}
                error={hasError('test')}
                helperText={hasError('test') ? formState.errors.test[0] : null}
                label="Loại trái cây"
                name="test"
                value={formState.values.test || ''}
                variant="outlined"
              />
            )}
          />
          <TextField
            className={classes.field}
            error={hasError('code')}
            fullWidth
            helperText={hasError('code') ? formState.errors.code[0] : null}
            label="Mã"
            name="code"
            onChange={handleChange}
            value={formState.values.code || ''}
            variant="outlined"
          />

          <TextField
            className={classes.field}
            error={hasError('name')}
            fullWidth
            helperText={hasError('name') ? formState.errors.name[0] : null}
            label="Tên"
            name="name"
            onChange={handleChange}
            value={formState.values.name || ''}
            variant="outlined"
          />
          <Grid container spacing={1}>
            <Grid item md={3} xs={12}>
              {' '}
              <FormControl className={classes.formControl} variant="outlined" fullWidth>
                <InputLabel>Tỉnh/Thành Phố</InputLabel>
                <Select
                  error={hasError('city')}
                  name="city"
                  label="Tỉnh/Thành Phố"
                  onChange={handleChange}
                  value={formState.values.city || ''}>
                  {citys.map((pro, index) => (
                    <MenuItem key={index} value={pro.id}>
                      {pro.cityName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {hasError('city') ? formState.errors.city[0] : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12}>
              <FormControl className={classes.formControl} variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Quận/Huyện
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Quận/Huyện"
                  name="district"
                  value={formState.values.district || ''}
                  onChange={handleChange}>
                  {districts
                    .filter(dis => dis.cityID === formState.values.city)
                    .map((dis, index) => (
                      <MenuItem key={index} value={dis.id}>
                        {dis.districtName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12}>
              {' '}
              <FormControl className={classes.formControl} variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Xã/Thị trấn
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="ward"
                  label="Xã/Thị Trấn"
                  value={formState.values.ward || ''}
                  onChange={handleChange}>
                  {wards
                    .filter(
                      ward => ward.districtID === formState.values.district
                    )
                    .map((ward, index) => (
                      <MenuItem key={index} value={ward.id}>
                        {ward.wardName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField
                className={classes.field}
                error={hasError('address')}
                fullWidth
                helperText={
                  hasError('address') ? formState.errors.address[0] : null
                }
                label="Số/Đường"
                name="address"
                onChange={handleChange}
                value={formState.values.address || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>

          {selectedGarden ? (
            <FormControl className={classes.field} variant="outlined" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">
                Trạng thái
              </InputLabel>
              <Select
                id="demo-simple-select-outlined"
                label="Trạng thái"
                labelId="demo-simple-select-outlined-label"
                name="status"
                onChange={handleChange}
                value={formState.values.status}>
                <MenuItem value={1}>Hoạt động</MenuItem>
                <MenuItem value={0}>Tạm ngừng</MenuItem>
              </Select>
            </FormControl>
          ) : null}
        </CardContent>
        <Divider />
        <CardActions>
          {/* <IconButton edge="start" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton> */}
          <Button
            className={classes.cancelButton}
            onClick={onCancel}
            variant="contained">
            Hủy bỏ
          </Button>
          {mode === 'add' ? (
            <Button
              className={classes.confirmButton}
              disabled={!formState.isValid}
              onClick={handleAdd}
              variant="contained">
              Tạo
            </Button>
          ) : (
            <Button
              className={classes.confirmButton}
              disabled={!formState.isValid}
              onClick={handleEdit}
              variant="contained">
              Lưu
            </Button>
          )}
        </CardActions>
      </form>
    </Card>
  );
});

AddEditEvent.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object,
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default AddEditEvent;
