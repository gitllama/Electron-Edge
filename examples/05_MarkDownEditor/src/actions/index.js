//Action & Action Creator
const INCREMENT = 'INCREMENT';
const CHANGE = 'CHANGE';

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
