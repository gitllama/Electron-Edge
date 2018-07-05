import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';

import takeSagas from './sagas.js';

// saga monitor
// ['ACTION_NAME_THROUGH']
// ['ACTION_NAME_ASYNC']       : 連射すると遅れてまとめて帰ってくる
// ['ACTION_NAME_ASYNCLATEST'] : 最後だけ返る（すでに動いてても呼び出しは起こる）

function* setTake(actionName, callback) {
  if(actionName.indexOf("_ASYNCLATEST") > 0){
    yield takeLatest(actionName, callback);
  }
  else if(actionName.indexOf("_ASYNC") > 0){
    yield takeEvery(actionName, callback);
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
  }
}

export default function* rootSaga() {
  for(let key in takeSagas){
    yield fork(setTake, key, takeSagas[key]);
  }
}
