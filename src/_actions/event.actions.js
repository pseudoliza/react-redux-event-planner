import { eventConstants } from '../_constants';
import { eventService } from '../_services';
import { alertActions } from './';
import { history } from '../config';

const create = (event) => {
  const request = (event) => ({ type: eventConstants.CREATE_REQUEST, event });
  const success = (event) => ({ type: eventConstants.CREATE_SUCCESS, event });
  const failure = (error) => ({ type: eventConstants.CREATE_FAILURE, error });

  return dispatch => {
    dispatch(request(event));
    eventService.create(event)
      .then(
        event => {
          dispatch(success(event));
          dispatch(alertActions.success('Event successfully created'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };
}

const update = (event) => {
  const request = (event) => ({ type: eventConstants.UPDATE_REQUEST, event });
  const success = (event) => ({ type: eventConstants.UPDATE_SUCCESS, event });
  const failure = (error) => ({ type: eventConstants.UPDATE_FAILURE, error });

  return dispatch => {
    dispatch(request(event));
    eventService.update(event)
      .then(
        event => {
          dispatch(success(event));
          dispatch(alertActions.success('Event successfully updated'));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };
}

const select = (event) => ({ type: eventConstants.SELECT, event });

const dropSelection = () => ({ type: eventConstants.SELECT_DROP });

const getAll = () => {
  const request = () => ({ type: eventConstants.GETALL_REQUEST });
  const success = (events) => ({ type: eventConstants.GETALL_SUCCESS, events });
  const failure = (error) => ({ type: eventConstants.GETALL_FAILURE, error });

  return dispatch => {
    dispatch(request());

    eventService.getAll()
      .then(
        events => dispatch(success(events)),
        error => dispatch(failure(error))
      );
  };
}

const _delete = (id) => {
  const request = (id) => ({ type: eventConstants.DELETE_REQUEST, id });
  const success = (id) => ({ type: eventConstants.DELETE_SUCCESS, id });
  const failure = (id, error) => ({ type: eventConstants.DELETE_FAILURE, id, error });

  return dispatch => {
    dispatch(request(id));

    eventService.delete(id)
      .then(
        event => dispatch(success(id)),
        error => dispatch(failure(id, error))
      );
  };
}

export const eventActions = {
  create,
  select,
  dropSelection,
  update,
  getAll,
  delete: _delete
};
