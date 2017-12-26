import { createStore, applyMiddleware } from 'redux';
import { app, ipcMain } from 'electron';

import createSagaMiddleware from 'redux-saga';

import rootSaga from '../reducers/rootSaga';
import { mainReducer } from '../reducers';
import { CreateWindow } from './window';
import { initialState } from '../initialState';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  mainReducer,
  initialState,
  applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);

let win = null;

ipcMain.on('state', (event, arg) => { event.returnValue = store.getState().toJS(); });
ipcMain.on('notification', (event, arg) => { store.dispatch(arg); });

const isMac = process.platform === 'darwin';
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.on('ready', () => {
  win = new CreateWindow(store);
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (win.mainWindow === null) {
    win.createWindow();
  }
});
