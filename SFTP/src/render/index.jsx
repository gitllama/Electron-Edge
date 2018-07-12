import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';
import { ipcRenderer } from 'electron'

import App from './components/App.jsx';
import reducer from './reducers'
import rootSaga  from './sagas'
import actions from './actions'

module.exports =(arg)=>{
  console.log("open", arg);

  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducer, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga);

  Object.keys(actions).forEach((key)=>{
    ipcRenderer.on(actions[key].toString(), (event, param) =>{
      store.dispatch({
        type  : actions[key].toString(),
        payload : param
      });
    })
  });

  ipcRenderer.on("connect", (event, param) =>{
    store.dispatch({
      type  : "CONNECT_ASYNCLATEST",
      payload : param
    });
  });

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );

}
