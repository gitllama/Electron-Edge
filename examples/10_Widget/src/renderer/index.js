import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';

import App from './components/App';
import reducer from './reducers'
import rootSaga  from './sagas'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

const ipcRenderer = require("electron").ipcRenderer;

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
const hoge = require('electron').remote.require('../main/main')
hoge.A(0)




const config = ipcRenderer.sendSync('config')
for(let key in config["shortcut"]["global"]){
  ipcRenderer.on(key, (event, param) => {
    store.dispatch({type: param});
  });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
