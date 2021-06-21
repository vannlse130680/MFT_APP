/* eslint-disable react/display-name */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  colors,
  Divider,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { showLoadingChildren } from 'actions/childrenLoading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import GoblaLoadingChildren from 'utils/globalLoadingChildren/GoblaLoadingChildren';
import validate from 'validate.js';
import firebase from '../../../../../../../firebase/firebase';
const schema = {
  desc: {
    presence: { allowEmpty: false, message: 'Không thể bỏ trống' },
    length: {
      maximum: 100,
      message: 'Tối đa chỉ 100 kí tự '
    }
  },
  image: {
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
    selectedTreeProcess,
    ...rest
  } = props;

  const classes = useStyles();
  const [imageState, setImageState] = useState({
    image: null,
    progress: 0,
    downloadURL: null
  });
  const dispatch = useDispatch();
  const [treeTypes, setTreeTypes] = useState([]);
  const [formState, setFormState] = useState({
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
    if (selectedTreeProcess)
      setFormState(formState => ({
        ...formState,
        values: {
          image: selectedTreeProcess.processImage,
          desc: selectedTreeProcess.description
        }
      }));
  }, []);
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  // const [values, setValues] = useState(event || defaultEvent);

  const mode = event ? 'edit' : 'add';

  const handleChange = (event, value) => {
    if (!event) return;

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

  const handleDelete = () => {
    onDelete && onDelete(event);
  };

  const handleAdd = () => {
    dispatch(showLoadingChildren());
    let file = imageState.image;
    if (file) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child('folder/' + file.name).put(file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFormState(formState => ({
            ...formState,
            values: {
              ...formState.values,
              progress: progress
            }
          }));
        },
        error => {
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            var { values } = formState;
            var data = {
              processImage: url,
              description: values.desc
            };

            onAdd(data);
          });
          // document.getElementById('file').value = null;
        }
      );
    }
  };

  const handleEdit = () => {
    dispatch(showLoadingChildren());
    let file = imageState.image;
    if (file) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef.child('folder/' + file.name).put(file);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFormState(formState => ({
            ...formState,
            values: {
              ...formState.values,
              progress: progress
            }
          }));
        },
        error => {
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            var { values } = formState;
            var data = {
              id: selectedTreeProcess.id,
              processImage: url,
              description: values.desc
            };

            onEdit(data);
          });
          // document.getElementById('file').value = null;
        }
      );
    } else {
      var { values } = formState;
      var data = {
        id: selectedTreeProcess.id,
        processImage: values.image,
        description: values.desc
      };

      onEdit(data);
    }
    // console.log(formState.values);
    // var data = {
    //   id: selectedPlantType.id,
    //   treeTypeID: formState.values.auto.id,
    //   plantTypeName: formState.values.name,
    //   farmerUsername: username,
    //   supplier: formState.values.supplier,
    //   crops: parseInt(formState.values.crops),
    //   yield: parseFloat(formState.values.yield),
    //   price: parseInt(formState.values.price),
    //   status: formState.values.status
    // };
    // // console.log(data)
  };
  const handleImageChange = e => {
    if (e.target.files[0]) {
      setImageState(imageState => ({
        ...imageState,
        image: e.target.files[0]
      }));
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          image: 'null'
        }
      }));
      var oFReader = new FileReader();
      oFReader.readAsDataURL(e.target.files[0]);
      oFReader.onload = function(oFREvent) {
        document.getElementById('treeImg').src = oFREvent.target.result;
      };
    }
    console.log(e.target.files[0]);
  };
  const handleRemoveImage = () => {
    document.getElementById('inputFileToLoad').value = null;
    setImageState(imageState => ({
      ...imageState,
      image: null
    }));
    document.getElementById('treeImg').src = '/images/treeDefault.png';
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        image: null
      }
    }));
  };
  // console.log(selectedPlantType);
  return (
    <Card {...rest} className={clsx(classes.root, className)} ref={ref}>
      <GoblaLoadingChildren />
      <form>
        <CardContent>
          <Typography align="center" gutterBottom variant="h3">
            {mode === 'add' ? 'Thêm loại cây' : 'Cập nhật loại cây'}
          </Typography>
          <Grid container spacing={1}>
            <Grid container item xs={6}>
              <Grid justify="center" container item xs={12}>
                <div>
                  <img
                    id="treeImg"
                    src={
                      formState.values.image && formState.values.image !== ''
                        ? formState.values.image
                        : '/images/treeDefault.png'
                    }
                    style={{ width: 300, height: 500 }}
                  />
                </div>
              </Grid>
              <Grid justify="center" container item xs={12}>
                <Button
                  size="small"
                  variant="outlined"
                  component="label"
                  className={classes.attachImageButton}>
                  Tải ảnh lên
                  <input
                    id="inputFileToLoad"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </Button>{' '}
                <Button
                  onClick={handleRemoveImage}
                  variant="outlined"
                  component="label"
                  className={classes.removeImageButton}>
                  Gỡ
                </Button>{' '}
              </Grid>
            </Grid>
            <Grid alignItems="center" container item xs={6}>
              <TextField
                className={classes.field}
                error={hasError('desc')}
                fullWidth
                multiline
                rows={5}
                helperText={hasError('desc') ? formState.errors.desc[0] : null}
                label="Mô tả"
                name="desc"
                onChange={handleChange}
                value={formState.values.desc || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
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
