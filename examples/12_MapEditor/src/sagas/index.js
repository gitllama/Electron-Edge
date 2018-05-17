import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';

import * as g from './generator.js';

const takeSagas = {
  // ['PATTERN_D_THROUGH'] : (state, action)=>(
  //   state.withMutations(m => (
  //     m.set('count', state.get("count")+1)
  //   ))
  // ),
  // ['PATTERN_D_INC_ASYNC'] : incAsync, //連射すると遅れてまとめて帰ってくる
  // ['PATTERN_D_INC_ASYNCLATEST'] : incAsync, //最後だけ返る（すでに動いてても呼び出しは起こる）

  ['INIT_ASYNCLATEST'] : init,

  ['VIEW_CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('view', action.payload)
    ))
  ),

  ['SHORTCUT_INC'] : (state, action)=>(
    state.withMutations(m => (
      m.set('count', state.get("count")+1)
    ))
  ),

  ['READWELCOME_ASYNCLATEST'] : g.markdownAsync,
  ['READSQL_ASYNCLATEST'] : g.sqlAsync,
  ['READLOG_ASYNCLATEST'] : g.readlogAsync,
  ['READTEST_ASYNCLATEST'] : g.readtestAsync,

  ['EXPORTSVG_ASYNCLATEST'] : g.exportSVGAsync

};

function* init(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
      .set('config', action.payload)
      .set('mapconfig',action.payload["defaultmap"])
    )
  ));
}

//saga monitor---------------


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
