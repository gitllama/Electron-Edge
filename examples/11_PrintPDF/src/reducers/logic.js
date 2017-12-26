import actions from '../actions';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects';

// reducers, sagas

export const reducers = {
  CHANGE_INC: (state, action) => (
    state.withMutations(m => (
      m.set('count', m.get('count') + 1)
    ))
  ),
  CHANGE_RUN: (state, action) => (
    state.withMutations(m => (
      m.setIn(['monitor', 'enable'], action.payload)
    ))
  ),
};

export const sagas = {
  CHANGE_INC_ASYNC: incsync,
};


// logic

function* incsync(action) {
  // let type = yield select(state => state.get("type"))
  yield call(
    (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    2000
  )
  yield put(actions.changeInc());
}


//     ['STATE_CHANGE'] : (state, action) => (
//       action.payload(state)
//     )
