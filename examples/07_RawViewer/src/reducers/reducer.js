import Immutable from 'immutable';
import electron from 'electron';
import { takeEvery, takeLatest } from 'redux-saga/effects'
import { fetchDecord } from './sagas'

const defaultState = require('../config.json');


const initialState = Immutable.Map({
  imagedata : null,
  width : defaultState.width,
  height : defaultState.height,
  size :  defaultState.size,
  bitshift :  defaultState.bitshift,
  offset :  defaultState.offset,
  type :  defaultState.type,
  file : {name :"null"},
  onload : false,
  redraw : false
});

//ReadとChangeから自動的にDecordに伝播しなければならん
//それをComponentでやっているがあまり行儀よくは見えない
const reducers = {
  ['READ'] : (state, action) => (
    state.withMutations(m => (
      m.set('onload', false)
      .set('file', action.value)
    ))
  ),
  ['CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('onload', false)
      .set('bitshift', action.value.bitshift)
      .set('offset', action.value.offset)
    ))
  ),
  ['CHANGESIZE'] : (state, action) => (
    state.withMutations(m => (
      m.set('size', action.value)
    ))
  ),
  ['DECORD'] : (state, action) => (
    state.withMutations(m => (
      m.set('imagedata', action.value)
    ))
  ),
  ['TYPE'] : (state, action) => (
    state.withMutations(m => (
      m.set('type', action.value)
    ))
  ),
};

export function* rootSaga() {
  yield takeEvery('DECORD_ASYNC', fetchDecord);
}

export function reducer(state = initialState, action) {
  console.log(action)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
