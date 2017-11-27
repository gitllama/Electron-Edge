import Immutable from 'immutable'

const initialState = Immutable.Map({
  count : 1,
  text : "# markdown"
});

const reducers = {
  ['INCREMENT'] : (state, action) => state.set("count", state.get("count") + 1),
  ['CHANGE'] : (state, action) => (
    state.withMutations(m =>
      m.set('count', state.get('count') + 1)
       .set('text', action.value)
    )
  )
};

export default function reducer(state = initialState, action) {
  console.log(action)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
