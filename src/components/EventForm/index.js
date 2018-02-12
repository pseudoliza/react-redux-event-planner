import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { utils } from '../../helpers';
import { eventActions } from '../../_actions';

class EventForm extends React.Component {
  constructor(props) {
    super(props);
    const { event, user } = this.props;
    this.state = {
      event: {
        title: '',
        start: event.start,
        end: event.end,
        author: user,
        members: [
          user,
        ],
      },
      submitted: false
    };
    this.baseState = this.state;
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMembersChange = this.handleMembersChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(next) {
    if(next.event != this.props.event){
      this.setState(this.baseState);
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { event } = this.state;

    return this.setState({
      event: {
        ...event,
        [name]: value,
      }
    });
  }

  handleCancel(){
    this.setState(this.baseState);
    this.props.handleCancel();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { event } = this.state;
    if (event.title && event.start && event.end) {
      const userList = event.members.map(user => ({user: user, status: 0}));
      this.setState(
        { submitted: true }
      );
      event.members = userList,
      this.props.create(event);
    }
  }

  handleMembersChange(members) {
    const { event } = this.state;

    return this.setState({
      event: {
          ...event,
          members: members,
      }
    });
  }

  render() {
    const { creating, users } = this.props;
    const { event, submitted } = this.state;

    return (
      <Modal isOpen={this.state.event && !submitted} toggle={this.handleCancel} className={this.props.className}>
        <ModalHeader toggle={this.handleCancel}>Create Event</ModalHeader>
        <ModalBody>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input type="text" className="form-control" name="title" value={event.title} onChange={this.handleChange} />
              {submitted && !event.title && <div className="help-block">Title is required</div>}
            </div>
            <Select
              multi={true}
              value={event.members}
              onChange={this.handleMembersChange}
              valueKey="username"
              labelKey="username"
              options={users.items}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleSubmit}>Submit</Button>{' '}
          <Button color="secondary" onClick={this.handleCancel}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { events, authentication, users } = state;
  const { user } = authentication;
  const { creating } = events;
  return {
    user,
    users,
    creating
  };
}

const mapDispatchToProps = (dispatch) => ({
  create: (event) => {
    dispatch(eventActions.create(event));
  }
});

const connectedEventForm = connect(mapStateToProps, mapDispatchToProps)(EventForm);
export { connectedEventForm as EventForm };
