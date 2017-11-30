//Actions
export function fileread (val) {
  return {
    type: 'READ',
    value: val
  };
}
export function changeparam (val) {
  return {
    type: 'CHANGE',
    value: val
  };
}
export function changesize (val) {
  return {
    type: 'CHANGESIZE',
    value: val
  };
}
export function requestDecord(val) {
  return {
    type: 'DECORD_ASYNC',
    value: val
  };
}
export function receiveDecord (val) {
  return {
    type: 'DECORD',
    value: val
  };
}

export function changetype (val){
  return {
    type: 'TYPE',
    value: val
  };
}
export function onload (val){
  return {
    type: 'ONLOAD',
    value: val
  };
}
