import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App';
import { reducer, rootSaga }  from './reducers/reducer'

import createSagaMiddleware from 'redux-saga';
//import { runEdge } from './actions'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

//ipc2reducer
//mapDispatchToPropsにいれてもうごく
// const ipcRenderer = require("electron").ipcRenderer;
// ipcRenderer.on('runEdge', (event, param) => {
//   store.dispatch(runEdge(store.getState().get("input")));
// });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
