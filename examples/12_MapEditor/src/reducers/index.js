import Immutable from 'immutable';

const initialState = Immutable.Map({
  busy : true,

  config : null,
  view : "MAIN",
  html : null,

  mapconfig : null,
  wfresult : null,
  wfmap : null,
  lotno : "0001(AS5045)",
  wfselect : [1,2,3],
  wfviewmode : "TXT | BIN"
});

const reducers = {
  ['REDUCER_CHANGE'] : (state, action) => (
    action.payload(state)
  )
};
// .set('config', param)
//   .set('mapconfig', param["defaultmap"])
//

export default function reducer(state = initialState, action) {
  console.log("reducer", action.type)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
