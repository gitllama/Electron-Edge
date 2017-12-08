import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';
const ipcRenderer = require("electron").ipcRenderer;

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

//saga

const takeSagas = {
  ['PATTERN_D_ASYNC'] : hoge,
  ['PATTERN_D_THROUGH'] : (state, action)=>(
    state.withMutations(m => (
      m.set('val', action.payload)
    ))
  ),
  ['COMMAND_MESSAGE'] : (state, action)=>{
    ipcRenderer.send("displayBalloon", {title : 'Notification', content : 'Call!!', wait: 10000});
    return state;
  },
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
