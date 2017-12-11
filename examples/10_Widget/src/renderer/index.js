import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware,combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';
const ipcRenderer = require("electron").ipcRenderer;
import Immutable from 'immutable';
import App from './components/App';
import { rendererReducer }  from '../reducers'
//import rootSaga  from './sagas'


const store = createStore(
  rendererReducer,
  Immutable.fromJS(ipcRenderer.sendSync('state'))
);




/*
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  Immutable.Map(ipcRenderer.sendSync('state')),
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);
*/

ipcRenderer.on('notification', (event, arg) => { store.dispatch(arg) });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
