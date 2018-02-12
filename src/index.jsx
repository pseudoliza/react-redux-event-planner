import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store, configureFakeBackend } from './config';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.css';

configureFakeBackend();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
