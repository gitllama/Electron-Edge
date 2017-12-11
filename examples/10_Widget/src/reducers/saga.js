import actions from '../actions';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'

export default function* rootSaga() {
  for(let key in takeSagas) yield fork(setTake, key, takeSagas[key]);
}

function* setTake(actionName, callback) {
  if(actionName.indexOf("_ASYNCLATEST") > 0){
    yield takeLatest(actionName, callback);
  }
  else if(actionName.indexOf("_ASYNC") > 0){
    yield takeEvery(actionName, callback);
  }
  else{
    // yield takeEvery(
    //   actionName,
    //   function * (action){
    //     yield put(actions.reducerChange(
    //       state => callback(state, action)
    //     ))
    //   }
    // );
  }
}

const takeSagas = {
  ['READ_FILE_ASYNC'] : readfileasync,
  ['REFLASH_ASYNC'] : reflashasync,
};

function* readfileasync(action){
  //let type = yield select(state => state.get("type"))
  yield call(
    ((ms)=> new Promise(resolve => setTimeout(resolve, ms))),
    1000
  )
  yield put(actions.changeInc());
}
