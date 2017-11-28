import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App';
import { reducer, rootSaga }  from './reducers/reducer'
//import rootSaga from './reducers/sagas'

import createSagaMiddleware from 'redux-saga';
import { runEdge } from './actions'

//saga対応。
//const store = createStore(reducer);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

//ipc2reducer
//mapDispatchToPropsにいれてもうごく
const ipcRenderer = require("electron").ipcRenderer;
ipcRenderer.on('runEdge', (event, param) => {
  store.dispatch(runEdge(store.getState().get("input")));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// store.subscribe(() => { console.log(store.getState()); });
// const action = type => store.dispatch({type});
// action('INCREMENT');
