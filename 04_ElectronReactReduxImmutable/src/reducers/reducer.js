import Immutable from 'immutable'

const initialState = Immutable.Map({
  count : 1
});

const reducers = {
  ['INCREMENT'] : (state, action) => state.set("count", state.get("count") + 1),
};

export default function reducer(state = initialState, action) {
  console.log(action.type,action)
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
