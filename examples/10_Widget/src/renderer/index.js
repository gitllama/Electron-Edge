import Immutable from 'immutable';
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware,combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { ipcRenderer } from 'electron';

import App from './components/App';
import { rendererReducer }  from '../reducers'

const store = createStore(
  rendererReducer,
  Immutable.fromJS(ipcRenderer.sendSync('state'))
);

ipcRenderer.on('notification', (event, arg) => { store.dispatch(arg) });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
