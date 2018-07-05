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
const registerShortcut = require('../shortcut.json');
for(let key in registerShortcut["global"]){
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
