import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import { makeStyles } from '@material-ui/styles';
import { Calendar } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/vi';
import {
  Modal,
  Card,
  CardContent,
  colors,
  useTheme,
  useMediaQuery
} from '@material-ui/core';
import ReactDOM from 'react-dom';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';

import axios from 'utils/axios';
import { AuthGuard, Page } from 'components';
import { AddEditEvent, Toolbar } from './components';
import callAPI from 'utils/callAPI';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from 'actions/loading';

// let calendar = new Calendar(calendarEl, {
//   locale: esLocale
// });
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: theme.spacing(3),
    '& .fc-unthemed td': {
      borderColor: theme.palette.divider
    },
    '& .fc-widget-header': {
      backgroundColor: colors.grey[50]
    },
    '& .fc-axis': {
      ...theme.typography.body2
    },
    '& .fc-list-item-time': {
      ...theme.typography.body2
    },
    '& .fc-list-item-title': {
      ...theme.typography.body1
    },
    '& .fc-list-heading-main': {
      ...theme.typography.h6
    },
    '& .fc-list-heading-alt': {
      ...theme.typography.h6
    },
    '& .fc th': {
      borderColor: theme.palette.divider
    },
    '& .fc-day-header': {
      ...theme.typography.subtitle2,
      fontWeight: 500,
      color: theme.palette.text.secondary,
      padding: theme.spacing(1),
      backgroundColor: colors.grey[50]
    },
    '& .fc-day-top': {
      ...theme.typography.body2
    },
    '& .fc-highlight': {
      backgroundColor: colors.blueGrey[50]
    },
    '& .fc-event': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderWidth: 2,
      opacity: 0.9,
      '& .fc-time': {
        ...theme.typography.h6,
        color: 'inherit'
      },
      '& .fc-title': {
        ...theme.typography.body1,
        color: 'inherit'
      }
    },
    '& .fc-list-empty': {
      ...theme.typography.subtitle1
    }
  },
  card: {
    marginTop: theme.spacing(3)
  }
}));

const VisitCalendarPage = () => {
  const classes = useStyles();
  const calendarRef = useRef(null);
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [view, setView] = useState(mobileDevice ? 'listWeek' : 'timeGridWeek');
  const [date, setDate] = useState(moment().toDate());
  const [events, setEvents] = useState([]);
  const [eventModal, setEventModal] = useState({
    open: false,
    event: null
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showLoading());
    let mounted = true;

    const fetchEvents = () => {
      if (mounted) {
        var username = JSON.parse(sessionStorage.getItem('USER'))
          ? JSON.parse(sessionStorage.getItem('USER')).username
          : null;
        callAPI(
          `VisitingSchedule/getAllAcceptVisitingScheduleByUsername/${username}`,
          'GET',
          null
        )
          .then(res => {
            if (res.status === 200) {
              dispatch(hideLoading());
              var data = res.data;
              console.log(data);
              var events = [{}];
              for (let index = 0; index < data.length; index++) {
                var item = {
                  title: data[index].fullname + ', ' + data[index].gardenName,

                  start: data[index].visitDate,
                  id: index + ''
                };
                events.push(item);
              }
              setEvents(events);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    };

    fetchEvents();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    const newView = mobileDevice ? 'listWeek' : 'timeGridWeek';

    calendarApi.changeView(newView);
    setView(newView);
  }, [mobileDevice]);

  const handleEventClick = info => {
    const selected = events.find(event => event.id === info.event.id);

    setEventModal({
      open: true,
      event: selected
    });
  };

  const handleEventNew = () => {
    setEventModal({
      open: true,
      event: null
    });
  };

  const handleEventDelete = event => {
    setEvents(events => events.filter(e => e.id !== event.id));
    setEventModal({
      open: false,
      event: null
    });
  };

  const handleModalClose = () => {
    setEventModal({
      open: false,
      event: null
    });
  };

  const handleEventAdd = event => {
    setEvents(events => [...events, event]);
    setEventModal({
      open: false,
      event: null
    });
  };

  const handleEventEdit = event => {
    setEvents(events => events.map(e => (e.id === event.id ? event : e)));
    setEventModal({
      open: false,
      event: null
    });
  };

  const handleDateToday = () => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.today();
    setDate(calendarApi.getDate());
  };

  const handleViewChange = view => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.changeView(view);
    setView(view);
  };

  const handleDatePrev = () => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.prev();
    setDate(calendarApi.getDate());
  };

  const handleDateNext = () => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.next();
    setDate(calendarApi.getDate());
  };
  console.log(esLocale);
  const EventDetail = ({ event, el }) => {
    const content = (
      <div>
       
        {event.title} 
        {/* <div>{event.extendedProps.desc}</div> */}
      </div>
    );
    ReactDOM.render(content, el);
    return el;
  };
  return (
    <Page className={classes.root} title="L???ch tham quan v?????n">
      <AuthGuard roles={['N??ng d??n']} />
      <Toolbar
        date={date}
        onDateNext={handleDateNext}
        onDatePrev={handleDatePrev}
        onDateToday={handleDateToday}
        onEventAdd={handleEventNew}
        onViewChange={handleViewChange}
        view={view}
      />
      <Card className={classes.card}>
        <CardContent>
          <FullCalendar
            allDayMaintainDuration
            defaultDate={date}
            defaultView={view}
            droppable
            locale={esLocale}
            eventRender={EventDetail}
            
            eventResizableFromStart={false}
            events={events}
            header={true}
            height={800}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              timelinePlugin
            ]}
            ref={calendarRef}
            rerenderDelay={10}
            selectable
            weekends
          />
        </CardContent>
      </Card>
      <Modal onClose={handleModalClose} open={eventModal.open}>
        <AddEditEvent
          event={eventModal.event}
          onAdd={handleEventAdd}
          onCancel={handleModalClose}
          onDelete={handleEventDelete}
          onEdit={handleEventEdit}
        />
      </Modal>
    </Page>
  );
};

export default VisitCalendarPage;
