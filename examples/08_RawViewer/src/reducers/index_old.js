import Immutable from 'immutable';
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
  flagDecord : false,
  flagReadFile : false
});

const reducers = {
  ['REDUCER_CHANGE'] : (state, action) => (
    action.payload(state)
  )
};

export function reducer(state = initialState, action) {
  console.log(action.type)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}

import Immutable from 'immutable';
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
  flagDecord : false,
  flagReadFile : false
});

const reducers = {
  ['READ_FILE'] : (state, action) => (
    state.withMutations(m => (
      state.get('flagReadFile')
      ? state
      : m.set('file', action.payload)
         .set('flagReadFile', true)
    ))
  ),
  ['RECEIVE_RAW'] : (state, action) => (
    state.withMutations(m => (
      m.set('rawdata', action.payload.rawdata)
       .set('filename', action.payload.filename)
       .set('flagReadFile', false)
       .set('flagDecord', true)
    ))
  ),
  ['CHANGE_PARAMS'] : (state, action) => (
    state.withMutations(m => {
      m.set('bitshift', action.payload.bitshift)
       .set('offset', action.payload.offset)
       .set('params', Immutable.Map(action.payload))
       .set('flagDecord', true)
    })
  ),
  ['RECEIVE_DECORD'] : (state, action) => (
    state.withMutations(m => (
      m.set('imagedata', action.payload)
       .set('flagDecord', false)
    ))
  ),
  ['REFLASH'] : (state, action) => (
    state.withMutations(m => (
      m.set('flagDecord', true)
    ))
  ),

  ['REDUCER_CHANGE_SIZE'] : (state, action) => (
    state.withMutations(m => (
      m.set('size', action.payload)
    ))
  ),
  ['REDUCER_CHANGE_TYPE'] : (state, action) => (
    state.withMutations(m => (
      m.set('type', action.payload)
    ))
  ),
};

export function reducer(state = initialState, action) {
  console.log(action.type)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
