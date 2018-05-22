import Immutable from 'immutable';

const initialState = Immutable.Map({
  busy : true,

  config : null,
  title : "",
  docNo : "",
  view : "Editor",
  text : "# markdown",
  html : null
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
