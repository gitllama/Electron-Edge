import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';

import App from './components/App';
import reducer from './reducers'
import rootSaga  from './sagas'
import actions from './actions'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)


const ipcRenderer = require("electron").ipcRenderer;
Object.keys(actions).forEach((key)=>{
  ipcRenderer.on(actions[key].toString(), (event, param) =>{
    store.dispatch({
      type  : actions[key].toString(),
      payload : param
    });
  })
});


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
