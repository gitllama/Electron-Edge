import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';
import { ipcRenderer } from 'electron'
import styled from 'styled-components';

import reducer from './reducers'
import rootSaga  from './sagas'
import actions from './actions'

import App from './components/App.jsx';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

/*
Object.keys(actions).forEach((key)=>{
  ipcRenderer.on(actions[key].toString(), (event, param) =>{
    store.dispatch({
      type  : actions[key].toString(),
      payload : param
    });
  })
});
ipcRenderer.on("sync-html", (event, param) =>{
  store.dispatch({
    type  : "SYNC_HTML_ASYNCLATEST",
    payload : param
  });
});
*/


switch(process.argv[process.argv.length - 1]){
  default:
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
    break;
}
