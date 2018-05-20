import Immutable from 'immutable';

const initialState = Immutable.Map({
  busy : true,

  config : null,
  view : "MAIN",
  html : null,

  mapconfig : null,
  legend : null,
  wfresult : null,
  wfmap : null,
  selectchip : { "1":{ "1" :true } },

  lotno : "0001(AS5045)",
  wfselect : [1],
  wfviewmode : "TXT | BIN",
  selecttest : "bin"
});

const reducers = {
  ['REDUCER_CHANGE'] : (state, action) => (
    action.payload(state)
  )
};

export default function reducer(state = initialState, action) {
  console.log("reducer", action.type)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
