import { authHeader } from '../config';



const getAll = () => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch('/events', requestOptions).then(handleResponse);
}

const getById = (id) => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch('/events/' + _id, requestOptions).then(handleResponse);
}

const getByDate = (date) => {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch('/events/date/' + date, requestOptions).then(handleResponse);
}

const create = (event) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  };
  return fetch('/events/create', requestOptions).then(handleResponse);
}

const update = (event) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  };
  return fetch('/events/update', requestOptions).then(handleResponse);
}

const _delete = (id) => {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch('/events/' + id, requestOptions).then(handleResponse);
}

const handleResponse = (response) => {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}

export const eventService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};
