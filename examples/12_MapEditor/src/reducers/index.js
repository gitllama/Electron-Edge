import Immutable from 'immutable';

const initialState = Immutable.Map({
  busy : false,

  config : require('../../config.json'),
  view : "MAIN",
  html : null,

  mapconfig : require('../../data/mapconfig.json'),
  wfmap : null,
  lotno : "0001(AS5045)",
  wfselect : [1],
  wfviewmode : "TXT | BIN"
});

const reducers = {
  ['REDUCER_CHANGE'] : (state, action) => (
    action.payload(state)
  )
};

export default function reducer(state = initialState, action) {
  // console.log("reducer", action.type)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
