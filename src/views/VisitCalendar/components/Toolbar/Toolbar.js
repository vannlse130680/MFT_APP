import React from 'react';
import clsx from 'clsx';
import moment, { localeData } from 'moment';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Hidden,
  Typography,
  Tooltip,
  ButtonGroup,
  IconButton,
  Button
} from '@material-ui/core';
import ViewConfigIcon from '@material-ui/icons/ViewComfyOutlined';
import ViewWeekIcon from '@material-ui/icons/ViewWeekOutlined';
import ViewDayIcon from '@material-ui/icons/ViewDayOutlined';
import ViewAgendaIcon from '@material-ui/icons/ViewAgendaOutlined';
import 'moment/locale/vi' 

const useStyles = makeStyles(() => ({
  root: {}
}));

const Toolbar = props => {
  const {
    date,
    view,
    onDatePrev,
    onDateNext,
    onEventAdd,
    onViewChange,
    onDateToday,
    className,
    ...rest
  } = props;

  const classes = useStyles();

  const viewOptions = [
    {
      label: 'Month',
      value: 'dayGridMonth',
      icon: ViewConfigIcon
    },
    {
      label: 'Week',
      value: 'timeGridWeek',
      icon: ViewWeekIcon
    },
    {
      label: 'Day',
      value: 'timeGridDay',
      icon: ViewDayIcon
    },
    {
      label: 'Agenda',
      value: 'listWeek',
      icon: ViewAgendaIcon
    }
  ];

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            Lịch
          </Typography>
          <Typography component="h1" variant="h3">
            Lịch tham quan vườn
          </Typography>
        </Grid>
        {/* <Grid item>
          <Button color="primary" onClick={onEventAdd} variant="contained">
            Add event
          </Button>
        </Grid> */}
      </Grid>
      <Grid alignItems="center" container justify="space-between" spacing={3}>
        <Grid item>
          <ButtonGroup>
            <Button onClick={onDatePrev}>Sau</Button>
            <Button onClick={onDateToday}>Hôm nay</Button>
            <Button onClick={onDateNext}>Trước</Button>
          </ButtonGroup>
        </Grid>
        <Hidden smDown>
          <Grid item>
            <Typography variant="h3">
              {moment(date).locale('vi').format('MMMM YYYY')}
            </Typography>
          </Grid>
          {/* <Grid item>
            {viewOptions.map(viewOption => {
              const Icon = viewOption.icon;

              return (
                <Tooltip key={viewOption.value} title={viewOption.label}>
                  <IconButton
                    color={viewOption.value === view ? 'primary' : 'default'}
                    onClick={() => onViewChange(viewOption.value)}>
                    <Icon />
                  </IconButton>
                </Tooltip>
              );
            })}
          </Grid> */}
        </Hidden>
      </Grid>
    </div>
  );
};

Toolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  date: PropTypes.any.isRequired,
  onDateNext: PropTypes.func,
  onDatePrev: PropTypes.func,
  onDateToday: PropTypes.func,
  onEventAdd: PropTypes.func,
  onViewChange: PropTypes.func,
  view: PropTypes.string.isRequired
};

export default Toolbar;
