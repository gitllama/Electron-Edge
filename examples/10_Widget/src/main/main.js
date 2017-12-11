import Immutable from 'immutable';
import { createStore, applyMiddleware } from 'redux'
import { ipcMain } from 'electron';

import createSagaMiddleware from 'redux-saga';

import rootSaga  from '../reducers/sagas'
import { mainReducer }  from '../reducers'
import { CreateWindow } from './window'
import {initialState} from '../initialState';

/*
const store = createStore(
  mainReducer,
  initialState
);
*/
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  mainReducer,
  initialState,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

ipcMain.on('state', (event, arg) =>{ event.returnValue = store.getState().toJS(); });
ipcMain.on('notification', (event, arg) =>{ store.dispatch(arg); });

let win = new CreateWindow(store);
