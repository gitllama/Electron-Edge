import Immutable from 'immutable';

const initialState = Immutable.Map({
  val : "start",
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
