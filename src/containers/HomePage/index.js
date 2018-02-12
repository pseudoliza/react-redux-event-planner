import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button } from 'reactstrap';
import { Calendar } from '../../components/Calendar';
import { Event } from '../../components/Event';
import { EventForm } from '../../components/EventForm';
import { utils } from '../../helpers';

import { userActions, eventActions, alertActions } from '../../_actions';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      new: null,
    };

    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
    this.handleSelectSlot = this.handleSelectSlot.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    this.props.getUsers();
    this.props.getEvents();
  }

  handleDeleteUser(id) {
    return () => this.props.deleteUser(id);
  }

  handleDeleteEvent(id) {
    return () => this.props.deleteEvent(id);
  }

  handleSelectSlot(info) {
    return this.setState({
      new: info,
    });
  }

  handleCancel() {
    return this.setState({
      new: null
    });
  }

  handleSelectEvent(event) {
    return () => this.props.select(event);
  }

  render() {
    const { user, users, events } = this.props;
    const my = (member) => member.user.id === user.id;
    const member = (item) => item.members.find(my);
    const author = (item) => item.author.id === user.id;

    return (
      <div className="row">
        <div className="col-md-2">
          <h4>Hi {user.firstName}!</h4>
          <h5>You are invited:</h5>
          {events.loading && <em>Loading events...</em>}
          {events.error && <span className="text-danger">{events.error}</span>}
          {events.items &&
            events.items.filter(member).map((event, index) =>
              <div key={event.id}>
                <Button key={event.id} color="link" onClick={this.handleSelectEvent(event)}>{event.title}</Button>
              </div>
            )
          }
          <h5>Management:</h5>
          {events.items &&
            events.items.filter(author).map((event, index) =>
              <div key={event.id}>
                <Button key={event.id} color="link" onClick={this.handleSelectEvent(event)}>{event.title}</Button>
              </div>
            )
          }
          <p>
            <Link to="/login">Logout</Link>
          </p>
          <h6>All registered users:</h6>
          {users.loading && <em>Loading users...</em>}
          {users.error && <span className="text-danger">ERROR: {users.error}</span>}
          {users.items &&
            <ul>
              {users.items.map((user) =>
                <li key={user.id}>
                  {user.firstName}{' '}{user.lastName}
                  {
                    user.deleting ? <em> - Deleting...</em>
                    : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                    : <span> - <a onClick={this.handleDeleteUser(user.id)}>
                      Delete
                    </a></span>
                  }
                </li>
              )}
            </ul>
          }
        </div>
        <div className="col-md-10">
          <Calendar handleSelectSlot={this.handleSelectSlot}/>
          {events.selected &&
            <Event />
          }
          {this.state.new &&
            <EventForm handleCancel={this.handleCancel} event={this.state.new} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { users, authentication, events } = state;
  const { user } = authentication;
  return {
    user,
    users,
    events
  };
}

const mapDispatchToProps = (dispatch) => ({
  getUsers: () => {
    dispatch(userActions.getAll());
  },
  getEvents: () => {
    dispatch(eventActions.getAll());
  },
  deleteUser: (id) => {
    dispatch(userActions.delete(id));
  },
  deleteEvent: (id) => {
    dispatch(eventActions.delete(id));
  },
  select: (event) => {
    dispatch(eventActions.select(event));
  },
});

const connectedHomePage = connect(mapStateToProps, mapDispatchToProps)(HomePage);
export { connectedHomePage as HomePage };
