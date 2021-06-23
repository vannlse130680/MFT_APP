/* eslint-disable react/display-name */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  colors,
  Divider,
  TextField,
  Typography
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/styles';
import { showLoadingChildren } from 'actions/childrenLoading';
import clsx from 'clsx';
import { partition } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch } from 'react-redux';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import validate from 'validate.js';
validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse: function(value, options) {
    return +moment.utc(value);
  },
  // Input is a unix timestamp
  format: function(value, options) {
    var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  }
});

// name: {
//   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
//   length: {
//     maximum: 100,
//     message: 'Tối đa chỉ 100 kí tự '
//   }
// },
// supplier: {
//   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
//   length: {
//     maximum: 200,
//     message: 'Tối đa chỉ 200 kí tự '
//   }
// },

// yield: {
//   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
//   numericality: {
//     greaterThan: 0,
//     lessThanOrEqualTo: 1000,
//     message: 'Năng suất phải lớn 0 và bé hơn 10000kg'
//   }
// },
// crops: {
//   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
//   numericality: {
//     onlyInteger: true,
//     greaterThan: 0,
//     lessThanOrEqualTo: 100,
//     message: 'Số vụ phải lớn 0 và bé hơn 100 và là số nguyên'
//   }
// },
// price: {
//   presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
//   numericality: {
//     onlyInteger: true,

//     greaterThan: 0,
//     lessThanOrEqualTo: 100000000,
//     message: 'Giá phải lớn 0 và bé hơn 100000000 và là số nguyên'
//   }
// }
const schemaYield = {
  totalYield: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' }
  }
};
const schema = {
  startDate: {
    datetime: {
      dateOnly: true,

      message: 'Bạn cần đủ 18 tuổi'
    }
  },
  endDate: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    datetime: {
      dateOnly: true,
      // earliest: formState.values.startDate,
      message: 'Bạn cần đủ 18 tuổi'
    }
  }
};
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      isNumericString
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator={'.'}
      decimalSeparator={','}
    />
  );
}
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
  contentSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  }
}));

// eslint-disable-next-line react/no-multi-comp
const AddEditEvent = forwardRef((props, ref) => {
  const {
    event,
    onDelete,
    onCancel,
    onAdd,
    onEdit,
    className,
    selectedContractDetail,
    onEditDate,
    customerUsername,
    onEditYield,
    ...rest
  } = props;

  const classes = useStyles();
  const [expandDate, setExpandDate] = useState(true);
  const [expandYield, setExpandYield] = useState(true);
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const [formStateYield, setFormStateYield] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema, { fullMessages: false });

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);
  useEffect(() => {
    const errors = validate(formStateYield.values, schemaYield, {
      fullMessages: false
    });

    setFormStateYield(formStateYield => ({
      ...formStateYield,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formStateYield.values]);
  useEffect(() => {
    if (selectedContractDetail) {
      setFormState(formState => ({
        ...formState,
        values: {
          startDate: moment(selectedContractDetail.startHarvest).format(
            'YYYY-MM-DD'
          ),
          endDate: moment(selectedContractDetail.endHarvest).format(
            'YYYY-MM-DD'
          ),
          yield: selectedContractDetail.yield
        }
      }));
      setFormStateYield(formStateYield => ({
        ...formStateYield,
        values: {
          totalYield: selectedContractDetail.yield
        }
      }));
    }
  }, []);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  // const [values, setValues] = useState(event || defaultEvent);
  const hasErrorYield = field =>
    formStateYield.touched[field] && formStateYield.errors[field]
      ? true
      : false;
  const mode = event ? 'edit' : 'add';

  const handleChange = (event, value) => {
    if (!event) return;
    /// changehere

    event.persist();

    if (event.target.name) {
      console.log('status');
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
    }
  };
  const handleChangeYield = (event, value) => {
    if (!event) return;
    /// changehere

    event.persist();

    if (event.target.name) {
      setFormStateYield(formStateYield => ({
        ...formStateYield,
        values: {
          ...formStateYield.values,
          [event.target.name]:
            event.target.type === 'checkbox'
              ? event.target.checked
              : event.target.value === ''
              ? null
              : event.target.value
        },
        touched: {
          ...formStateYield.touched,
          [event.target.name]: true
        }
      }));
    }
  };

  const handleEditDate = () => {
    dispatch(showLoadingChildren());
    var data = {
      id: selectedContractDetail.id,
      startHarvest: formState.values.startDate,
      endHarvest: formState.values.endDate
    };
    onEditDate(data);
  };
  // console.log(selectedPlantType);
  const handleToggleDate = () => {
    setExpandDate(expandDate => !expandDate);
  };
  const handleToggleYield = () => {
    setExpandYield(expandYield => !expandYield);
  };

  const handleEditYield = () => {
    dispatch(showLoadingChildren());
    var data = {
      contractDetailId: selectedContractDetail.id,
      username: customerUsername,
      yield: parseFloat(formStateYield.values.totalYield)
    };

    console.log(data);
    onEditYield(data)
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <GoblaLoadingChildren />
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm loại cây' : 'Cập nhật'}
          </Typography>
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleDate}>
              <Typography variant="h5">Thời gian có thể thu hoạch</Typography>
              {expandDate ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandDate}>
              <div className={classes.contentSectionContent}>
                <div className={classes.formGroup}>
                  <TextField
                    InputProps={{
                      inputProps: {
                        min: moment().format('YYYY-MM-DD'),
                        max: formState.values.endDate
                      }
                    }}
                    error={hasError('startDate')}
                    helperText={
                      hasError('startDate')
                        ? formState.errors.startDate[0]
                        : null
                    }
                    onChange={handleChange}
                    fullWidth
                    name="startDate"
                    variant="outlined"
                    value={
                      moment(formState.values.startDate).format('YYYY-MM-DD') ||
                      ''
                    }
                    label="Bắt đầu"
                    type="date"
                    // defaultValue="1999-06-03"
                    className={classes.field}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <TextField
                    InputProps={{
                      inputProps: { min: formState.values.startDate }
                    }}
                    error={hasError('endDate')}
                    helperText={
                      hasError('endDate') ? formState.errors.endDate[0] : null
                    }
                    onChange={handleChange}
                    name="endDate"
                    variant="outlined"
                    value={
                      moment(formState.values.endDate).format('YYYY-MM-DD') ||
                      ''
                    }
                    label="Kết thúc"
                    type="date"
                    fullWidth
                    // defaultValue="1999-06-03"
                    className={classes.field}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </div>
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

                  <Button
                    className={classes.confirmButton}
                    disabled={!formState.isValid}
                    onClick={handleEditDate}
                    variant="contained">
                    Lưu
                  </Button>
                </CardActions>
              </div>
            </Collapse>
          </div>
          <div className={classes.contentSection}>
            <div
              className={classes.contentSectionHeader}
              onClick={handleToggleYield}>
              <Typography variant="h5">Tổng sản lượng thu hoạch</Typography>
              {expandYield ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Divider />
            <Collapse in={expandYield}>
              <div className={classes.contentSectionContent}>
                <TextField
                  error={hasErrorYield('totalYield')}
                  helperText={
                    hasErrorYield('totalYield')
                      ? formStateYield.errors.totalYield[0]
                      : null
                  }
                  fullWidth
                  type="number"
                  onChange={handleChangeYield}
                  name="totalYield"
                  variant="outlined"
                  value={formStateYield.values.totalYield || ''}
                  label="Tổng sản lượng"
                  // defaultValue="1999-06-03"
                  className={classes.field}
                />

                <CardActions>
                  <Button
                    className={classes.cancelButton}
                    onClick={onCancel}
                    variant="contained">
                    Hủy bỏ
                  </Button>

                  <Button
                    className={classes.confirmButton}
                    disabled={!formStateYield.isValid}
                    onClick={handleEditYield}
                    variant="contained">
                    Lưu
                  </Button>
                </CardActions>
              </div>
            </Collapse>
          </div>
        </CardContent>
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
