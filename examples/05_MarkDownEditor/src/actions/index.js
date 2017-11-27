//Action
const INCREMENT = 'INCREMENT';
const CHANGE = 'CHANGE';

//Action Creator
export function increment() {
  return {
    type: INCREMENT
  };
}
export function changetext(val) {
  return {
    type: CHANGE,
    value: val
  };
}
