import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';

export default {
  ['INIT_ASYNCLATEST'] : init,

  ['TEXT_CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('text', action.payload)
    ))
  )
};


function* init(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('config', action.payload)
    )
  ));

  // yield markdownAsync({payload : "# markdown"})
  //yield readfileAsync({payload : path.join(__dirname, '../../Empty.md')})

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
    )
  ));
}
