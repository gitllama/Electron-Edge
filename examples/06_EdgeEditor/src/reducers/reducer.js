import Immutable from 'immutable';
import electron from 'electron';
import { takeEvery, takeLatest } from 'redux-saga/effects'
import { fetchEdge } from './sagas'

const initialState = Immutable.Map({
  input : "async (input) => \"Hello Edge !\";",
  output : "Welcome",
  isFetching : false
});

//Reducer
//Reducerは副作用のないピュアな関数であることが求められますので、
//間接的にstate（新しいオブジェクトを生成）を変更します
//immutableが活躍

const reducers = {
  ['CHANGE'] : (state, action) => (
    state.withMutations(m =>
      m.set('input', action.value)
    )
  ),
  ['REQUEST_EDGE'] : (state, action)=> {
    return state.withMutations(m =>
      m.set('output', action.value)
      .set('isFetching', true)
    )
  },
  ['RECEIVE_EDGE'] : (state, action)=> (
    state.withMutations(m =>
      m.set('output', action.value)
      .set('isFetching', false)
    )
  ),
};

export function* rootSaga() {
  yield takeEvery('EDGE_ASYNC', fetchEdge);
}

export function reducer(state = initialState, action) {
  console.log(action)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
