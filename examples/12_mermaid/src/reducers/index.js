import Immutable from 'immutable';

const initialState = Immutable.Map({
  view : "WELCOME",

  val : "start",
  count : 0,
  buf : null,
  flag : false,
  svg : null,

  mapconfig : require('../../mapconfig.json'),
  wfmap : require('../../map.json'),
  lotno : "0001(AS5045)",
  wfselect : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
  wfobject : []
});

const reducers = {
  ['REDUCER_CHANGE'] : (state, action) => (
    action.payload(state)
  ),

  ['VIEW_CHANGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('view', action.payload)
    ))
  )
};

export default function reducer(state = initialState, action) {
  console.log("reducer", action.type)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
