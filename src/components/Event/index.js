import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { userActions, eventActions, alertActions } from '../../_actions';

const byStatus = (a, b) => parseFloat(a.status) - parseFloat(b.status);
const statusName = {
  0: 'pending',
  1: 'accepted',
  2: 'declined',
}

class Event extends React.Component {
  constructor(props){
    super(props);
    const { user, users, event } = props;
    this.isAuthor = event.author.id === user.id;
    const invited = event.members.find(member => member.user.id === user.id);
    this.time = moment(event.start).fromNow();

    this.pending = invited && invited.status === 0;
    this.accepted = invited && invited.status === 1;
    this.declined = invited && invited.status === 2;


    this.handleDeleteEvent =  this.handleDeleteEvent.bind(this);
    this.fullName = this.fullName.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
  }

  handleDeleteEvent(id) {
    return () => this.props.delete(id);
  }

  handleUpdateStatus(status) {
    const {event, user} = this.props;
    const {members} = event;
    const newEvent = event;
    const index = members.findIndex(member => member.user.id === user.id);
    newEvent.members[index].status = status;
    return this.props.update(newEvent);
  }

  handleAccept(){
    return this.handleUpdateStatus(1);
  }

  handleDecline(){
    return this.handleUpdateStatus(2);
  }

  handleCancel() {
    return this.props.drop();
  }

  fullName (member) {
    const { user } = this.props;
    return member.id === user.id ?
    'You' :
    `${member.firstName} ${ member.lastName}`;
  }

  render() {
    const { user, users, event } = this.props;
    const { fullName, pending, declined, accepted, time } = this;

    return (
      <Modal isOpen={this.props.event} toggle={this.handleCancel}>
        <ModalHeader toggle={this.handleCancel}>{event.title}</ModalHeader>
        <ModalBody>
          Author: { fullName(event.author) }<br/>
          Start: {time}<br/>
          Members:<br/>
          { event.members ?
            <ul>
              { event.members.sort(byStatus).map((member) =>
                <li key={member.user.id}>
                  {fullName(member.user)} - {statusName[member.status]}
                </li>
              )}
            </ul> : <span>Loading...</span>
          }
        </ModalBody>
        <ModalFooter>
          {this.isAuthor &&
            <Button color="link" onClick={this.handleDeleteEvent(event.id)}>
              {
                event.deleting ? <em> - Cancelling...</em>
                : event.deleteError ? <span className="text-danger">{user.deleteError}</span>
                : <span>Cancel event</span>
              }
            </Button>
          }
          { (pending || declined) &&
            <Button color="primary" onClick={this.handleAccept}>Accept</Button>
          }
          { (pending || accepted) &&
            <Button color="warning" onClick={this.handleDecline}>Decline</Button>
          }
        </ModalFooter>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
    const { users, authentication, events } = state;
    const { user } = authentication;
    const event = events.selected ;
    return {
        user,
        event,
        users,
    };
}


const mapDispatchToProps = (dispatch) => ({
  delete: (id) => {
    dispatch(eventActions.delete(id));
  },
  update: (event) => {
    dispatch(eventActions.update(event));
  },
  drop: () => {
    dispatch(eventActions.dropSelection());
  },

});

const connectedEvent = connect(mapStateToProps, mapDispatchToProps)(Event);
export { connectedEvent as Event };
