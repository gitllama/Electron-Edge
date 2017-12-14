import { sagas } from './logic';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects';

export default function* rootSaga() {
  //for(let key in sagas) yield fork(setTake, key, sagas[key]);
  Object.keys(sagas).forEach((key) => {
    yield fork(setTake, key, sagas[key]);
  });
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
