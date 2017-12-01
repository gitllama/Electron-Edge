import Immutable from 'immutable';
import electron from 'electron';
import { takeEvery, takeLatest } from 'redux-saga/effects'
import { fetchDecord, fetchReadFile } from './sagas'

const defaultState = require('../config.json');

const initialState = Immutable.Map({
  imagedata : null,
  rawdata : new Int32Array(defaultState.width * defaultState.height),
  width : defaultState.width,
  height : defaultState.height,
  size :  defaultState.size,
  params : Immutable.Map({
    bitshift :  defaultState.bitshift,
    offset :  defaultState.offset,
  }),
  bitshift :  defaultState.bitshift,
  offset :  defaultState.offset,
  type :  defaultState.type,
  filename : null,
  onload : false,
  redraw : false
});

//ReadとChangeから自動的にDecordに伝播しなければならん
//それをComponentでやっているがあまり行儀よくは見えない

export function* rootSaga() {
  yield takeEvery('REQUEST_DECORD_ASYNC', fetchDecord);
  yield takeEvery('READ_FILE_ASYNC', fetchReadFile);
}

const reducers = {
  ['RECEIVE_RAW'] : (state, action) => (
    state.withMutations(m => (
      m.set('rawdata', action.payload.rawdata)
       .set('filename', action.payload.filename)
    ))
  ),
  ['READ_FILE'] : (state, action) => (
    state.withMutations(m => (
      m.set('file', action.payload)
    ))
  ),
  ['CHANGE_PARAMS'] : (state, action) => (
    state.withMutations(m => {
      return m.set('onload', false)
              .set('bitshift', action.payload.bitshift)
              .set('offset', action.payload.offset)
              .set('params', Immutable.Map(action.payload));
    })
  ),
  ['CHANGE_SIZE'] : (state, action) => (
    state.withMutations(m => (
      m.set('size', action.payload)
    ))
  ),
  ['RECEIVE_DECORD'] : (state, action) => (
    state.withMutations(m => (
      m.set('imagedata', action.payload)
    ))
  ),
  ['CHANGE_TYPE'] : (state, action) => (
    state.withMutations(m => (
      m.set('type', action.payload)
    ))
  ),
};

export function reducer(state = initialState, action) {
  //console.log(action)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
