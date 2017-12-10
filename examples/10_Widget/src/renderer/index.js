import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware,combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';
const ipcRenderer = require("electron").ipcRenderer;
import Immutable from 'immutable';
import App from './components/App';
import reducer from './reducers'
import rootSaga  from './sagas'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  Immutable.Map(ipcRenderer.sendSync('state')),
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

ipcRenderer.on('action', (event, arg) => {
  store.dispatch(arg);
});
ipcRenderer.on('notification', (event, arg) => {
  store.dispatch({type : ""});
});
//重い処理はBrowserProcessで動かして、RendererProcessからremoteモジュール経由でアクセスする
/*
const {BrowserWindow} = require('electron').remote
let win = new BrowserWindow({width: 800, height: 600})
win.loadURL('https://github.com')
//これでサブウインドウ開ける
require('electron').remote.getCurrentWindow().on('close', () => {
  // window was closed...
})
*/

//mainプロセスの変更できる
// const hoge = require('electron').remote.require('../main/main')
// hoge.A(0)


// const config = ipcRenderer.sendSync('config')
// for(let key in config["shortcut"]["global"]){
//   ipcRenderer.on(key, (event, param) => {
//     store.dispatch({type: param});
//   });
// }

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
