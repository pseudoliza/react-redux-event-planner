import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import HTML5Backend from 'react-dnd-html5-backend';
import BigCalendar from 'lib/ReactBigCalendar';
import withDragAndDrop from 'lib/ReactBigCalendar/addons/dragAndDrop';
import { DragDropContext } from 'react-dnd';
import { utils, min, max } from '../../helpers';
import { userActions, eventActions, alertActions } from '../../_actions';

import 'lib/ReactBigCalendar/css/react-big-calendar.css';
import 'lib/ReactBigCalendar/addons/dragAndDrop/styles.css';
import 'bootstrap/dist/css/bootstrap.css';

BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

class Calendar extends React.Component {
  constructor(props){
    super(props);

    this.handleSelectSlot =  this.handleSelectSlot.bind(this);
    this.handleSelectEvent = this.handleSelectEvent.bind(this);
    this.handleEventDrop = this.handleEventDrop.bind(this);
    this.handleUpdateEvent = this.handleUpdateEvent.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
    this.isAuthor = this.isAuthor.bind(this);
  }

  handleDeleteEvent(id) {
    return (e) => this.props.delete(id);
  }

  handleSelectEvent(event) {
    this.props.select(event);
  }

  handleSelectSlot(slotInfo) {
    const { items } = this.props.events || [];
    const {start, end} = slotInfo;

    if( !utils.isInFuture(start, end) ){
      return this.props.error('Room can not be booked in past.');
    }

    if( utils.isWeekend(start) ){
      return this.props.error('Room can not be booked on weekend.')
    }

    if( utils.isBusy(start, end, items)){
      return this.props.error('This time is not avaliable');
    }

    if( !utils.isWorkTime(start, end) ){
      return this.props.error('Room can be booked during working hours only.');
    }

    const event = {
      start,
      end,
      title: 'New Event',
      author: this.props.user.id,
    }
    return this.props.handleSelectSlot(event);
  }

  isAuthor (event) {
    const { user } = this.props;
    return event.author.id === user.id;
  }

  handleUpdateEvent(info){
    const { event, start, end } = info;
    const { items } = this.props.events;
    const events = items.filter(item => item.id !== event.id);

    if( !this.isAuthor(event) ){
      return this.props.error('You only can edit events you created');
    }

    if( !utils.isInFuture(start, end) ){
      return this.props.error('Room can not be booked in past.');
    }

    if( utils.isWeekend(start) ){
      return this.props.error('Room can not be booked on weekend.');
    }

    if( utils.isBusy(start, end, events) ){
      return this.props.error('This time is not avaliable');
    }

    if( !utils.isWorkTime(start, end) ){
      return this.props.error('Room can be booked during working hours only.');
    }

    if(utils.isSame(start, end, event)){
      return;
    }

    const newEvent = event;
    newEvent.start = start;
    newEvent.end = end;

    return this.props.update(newEvent);
  }

  resizeEvent(e, info) {
    return this.handleUpdateEvent(info);
  }

  handleEventDrop(info) {
    return this.handleUpdateEvent(info);
  }

  render() {
    const { events, user } = this.props;
    const eventlist = events.items ? utils.transformDate(events.items) : [];
    return (
      <DragAndDropCalendar
        selectable
        resizable
        min={min.toDate()}
        max={max.toDate()}
        defaultView="day"
        isAllDay={false}
        allDayAccessor={() => false}
        views={['work_week', 'day']}
        events={eventlist}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        onEventResize={this.resizeEvent}
        onSelectEvent={this.handleSelectEvent}
        onSelectSlot={this.handleSelectSlot}
        onEventDrop={this.handleEventDrop}
        step={15}
      />
    );
  }
}

function mapStateToProps(state) {
  const { authentication, events } = state;
  const { user } = authentication;
  return {
      user,
      events
  };
}

const mapDispatchToProps = (dispatch) => ({
  error: (message) => {
    dispatch(alertActions.error(message));
  },
  delete: (id) => {
    dispatch(eventActions.delete(id));
  },
  select: (event) => {
    dispatch(eventActions.select(event));
  },
  update: (event) => {
    dispatch(eventActions.update(event));
  }
});

const connectedCalendar = connect(mapStateToProps, mapDispatchToProps)(Calendar);
export { connectedCalendar as Calendar };
