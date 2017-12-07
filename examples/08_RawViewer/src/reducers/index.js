import Immutable from 'immutable';
const defaultState = require('../../config.json');

const initialState = Immutable.Map({
  imagedata : null,
  rawdata : new Int32Array(defaultState.width * defaultState.height),
  width : defaultState.width,
  height : defaultState.height,
  size :  defaultState.size,
  // params : Immutable.Map({
  //   bitshift :  defaultState.bitshift,
  //   offset :  defaultState.offset,
  // }),
  bitshift :  defaultState.bitshift,
  offset :  defaultState.offset,
  type :  defaultState.type,
  filename : null,
});

const reducers = {
  ['REDUCER_CHANGE'] : (state, action) => (
    action.payload(state)
  )
};

export default function reducer(state = initialState, action) {
  console.log(`Action : ${action.type}`)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
