import Immutable from 'immutable';

const initialState = Immutable.Map({
  imagedata : null,
  rawdata : new Int32Array(2256 * 1178),
  width : 2256,
  height : 1178,
  size :  1,
  bitshift :  0,
  offset :  0,
  type :  0,
  filename : null,
  message : ""
});

const reducers = {
  ['REDUCER_CHANGE'] : (state, action) => (
    action.payload(state)
  )
};

export default function reducer(state = initialState, action) {
  console.log("Action", action.type)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
