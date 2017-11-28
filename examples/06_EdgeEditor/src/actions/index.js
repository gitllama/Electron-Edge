//Action & Action Creator
const INCREMENT = 'INCREMENT';
const CHANGE = 'CHANGE';
const EDGE_ASYNC = 'EDGE_ASYNC';
const REQUEST_EDGE = 'REQUEST_EDGE';
const RECEIVE_EDGE = 'RECEIVE_EDGE';

export function changetext(val) {
  return {
    type: CHANGE,
    value: val
  };
}
export function runEdge(val) {
  return {
    type: EDGE_ASYNC,
    value: val
  };
}
export function requestEdge(val){
  return {
    type: REQUEST_EDGE,
    value: val
  };
}
export function receiveEdge(val){
  return {
    type: RECEIVE_EDGE,
    value: val
  };
}
