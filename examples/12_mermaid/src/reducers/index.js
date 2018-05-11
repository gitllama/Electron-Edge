import Immutable from 'immutable';

const initialState = Immutable.Map({
  val : "start",
  count : 0,
  buf : null,
  flag : false,
  svg : null,
  mapconfig : require('../../map.json'),
  wfmap : require('../../map0.json')
});

const reducers = {
    ['PATTERN_BASIC'] : (state, action) => (
    state.withMutations(m => (
      m.set('val', action.payload)
    ))
  ),

  ['PATTERN_C'] : (state, action) => (
    state.withMutations(m => (
      m.set('buf', action.payload)
       .set('flag', true)
    ))
  ),
  ['PATTERN_C_RETURN'] : (state, action) => (
    state.withMutations(m => (
      m.set('val', action.payload)
       .set('flag', false)
    ))
  ),

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
