import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
//import { takeSagas } from 'models.js';
import Immutable from 'immutable';

import {sqlAsync,markdownAsync} from './marked-mermaid.js';
import {readlogAsync} from './LogMatch.js';
//saga monitor

export default function* rootSaga() {
  for(let key in takeSagas){
    yield fork(setTake, key, takeSagas[key]);
  }
}

function* setTake(actionName, callback) {
  if(actionName.indexOf("_ASYNCLATEST") > 0){
    yield takeLatest(actionName, callback);
    console.log("registor :",actionName)
  }
  else if(actionName.indexOf("_ASYNC") > 0){
    yield takeEvery(actionName, callback);
    console.log("registor :",actionName)
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
    console.log("registor :",actionName)
  }
}

const takeSagas = {
  ['PATTERN_D_THROUGH'] : (state, action)=>(
    state.withMutations(m => (
      m.set('val', action.payload)
    ))
  ),
  ['PATTERN_D_INC'] : (state, action)=>(
    state.withMutations(m => (
      m.set('count', state.get("count")+1)
    ))
  ),
  ['PATTERN_D_INC_ASYNC'] : incAsync, //連射すると遅れてまとめて帰ってくる
  ['PATTERN_D_INC_ASYNCLATEST'] : incAsync, //最後だけ返る（すでに動いてても呼び出しは起こる）

  ['SHORTCUT_INC'] : (state, action)=>(
    state.withMutations(m => (
      m.set('count', state.get("count")+1)
    ))
  ),
  ['SQL_ASYNCLATEST'] : markdownAsync,
  ['READLOG_ASYNCLATEST'] : readlogAsync
};
