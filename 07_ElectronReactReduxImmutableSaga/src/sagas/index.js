import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';

//saga monitor

export default function* rootSaga() {
  //patternC
  yield fork(patternC);
  //patternD
  for(let key in takeSagas){
    yield fork(setTake, key, takeSagas[key]);
  }
  /*
    yield fork(setTake, 'PATTERN_D_ASYNC', hoge);
    yield fork(setTake, 'PATTERN_D_THROUGH', ((state, action)=>{
      console.log("saga", action.type)
      return state.withMutations(m => (
        m.set('val', action.payload)
      ))
    }))
  */
}

//patternD Helper
//forkで呼ばないと途中まではしらない
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

//saga
function* patternC() {
  while (true) {
    if( true == (yield select(state => state.get("flag"))) ){
      let params = yield select(state => state.get("buf"));
      yield put(actions.patternCReturn(params));
    }
    yield call(
      ((ms)=> new Promise(resolve => setTimeout(resolve, ms))),
      1000
    )
    //waitかけないとループ速すぎてつかめない?
  }
}

const takeSagas = {
  ['PATTERN_D_ASYNC'] : hoge,
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
};

function* hoge(action) {
  console.log("saga", action.type)
  yield call(
    ((ms)=> new Promise(resolve => setTimeout(resolve, ms))),
    1000
  )
  yield put(actions.reducerChange(
    ((state)=>(
      state.withMutations(m => (
        m.set('val', action.payload)
      ))
    ))
  ))
}

let callcount = 0;
function* incAsync(action) {
  console.log("saga", action.type, callcount++)
  yield call(
    ((ms)=> new Promise(resolve => setTimeout(resolve, ms))),
    2000
  )
  yield put(actions.reducerChange(
    (state)=>(
      state.withMutations(m => (
        m.set('count', state.get("count")+1)
      ))
    )
  ))
}
