//Action & Action Creator
const INCREMENT = 'INCREMENT';

export function increment() {
  return {
    type: INCREMENT
  };
}

//export default {
//  increment: () => ({ type: 'INCREMENT' }),
//  set : (key, val)=>({ type: 'SET', key : key, value : val});
//}
