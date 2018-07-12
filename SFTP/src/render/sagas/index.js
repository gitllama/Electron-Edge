import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';

import * as g from './generator.js';

// ['ACTION_NAME_THROUGH']
// ['ACTION_NAME_ASYNC']       : 連射すると遅れてまとめて帰ってくる
// ['ACTION_NAME_ASYNCLATEST'] : 最後だけ返る（すでに動いてても呼び出しは起こる）
const takeSagas = {
  ['INIT_ASYNCLATEST'] : g.init,

  ['PAGE_CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('page', state.get("page") + action.payload)
    ))
  ),

  ['CONNECT_ASYNCLATEST'] : g.connectAsync
};


// saga monitor

function* setTake(actionName, callback) {
  if(actionName.indexOf("_ASYNCLATEST") > 0){
    yield takeLatest(actionName, callback);
    //console.log("registor :",actionName)
  }
  else if(actionName.indexOf("_ASYNC") > 0){
    yield takeEvery(actionName, callback);
    //console.log("registor :",actionName)
  }
  else{
    yield takeEvery(
      actionName,
      function * (action){
        yield put(actions.reducerChange(
          state => callback(state, action)
        ))
      }
    );
    //console.log("registor :",actionName)
  }
}

export default function* rootSaga() {
  for(let key in takeSagas){
    yield fork(setTake, key, takeSagas[key]);
  }
}
