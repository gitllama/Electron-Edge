//import path from 'path';
import Immutable from 'immutable';
import { mainReducer }  from '../reducers'
import { createStore } from 'redux'
import { CreateWindow } from './window'
import {ipcMain} from 'electron';
import {initialState} from '../initialState';

let win = null;

const store = createStore(
  mainReducer,
  initialState
);
/*
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  state,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);
*/

ipcMain.on('state', (event, arg) =>{ event.returnValue = store.getState().toJS(); });
ipcMain.on('notification', (event, arg) =>{ store.dispatch(arg); });

win = new CreateWindow(store);
