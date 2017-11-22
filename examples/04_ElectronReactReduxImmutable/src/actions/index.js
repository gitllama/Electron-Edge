//Action
const INCREMENT = 'INCREMENT';

//Action Creator
export function increment() {
  return {
    type: INCREMENT
  };
}

//export default {
//  increment: () => ({ type: 'INCREMENT' }),
//  set : (key, val)=>({ type: 'SET', key : key, value : val});
//}
