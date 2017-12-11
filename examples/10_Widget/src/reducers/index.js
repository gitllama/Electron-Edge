const ipcRenderer = require("electron").ipcRenderer;

//const initialState = ipcRenderer.sendSync('state');

const reducers =
{
  ['CHANGE_INC'] : (state, action)=>(
    state.withMutations(m => (
      m.set('count', m.get('count')+1)
    ))
  ),
  ['CHANGE_RUN'] : (state, action)=>(
    state.withMutations(m => (
      m.setIn(['monitor','enable'], action.payload)
    ))
  )
}

// const reducers = Object.assign(
//   {
//     ['STATE_CHANGE'] : (state, action) => (
//       action.payload(state)
//     )
//   }
// );

export function mainReducer(state, action, win) {
  console.log(`mainAction : ${action.type}`)
  let meta =mergeMeta(action.meta);
  if(!meta.notification){
    meta.window.forEach((element, index)=>{
      if(element == null) return;
      element.webContents.send(
        'notification',
        {
          type : action.type,
          payload : action.payload,
          meta : { notification : true }
        }
      )
    });
  }
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}

export function rendererReducer(state, action) {
  console.log(`rendererAction : ${action.type}`)
  let meta = mergeMeta(action.meta);
  if(!meta.notification){
    ipcRenderer.send(
      'notification',
      {
        type : action.type,
        payload : action.payload,
        meta : { notification : true }
      }
    );
  }
  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}

function mergeMeta(meta){
  return Object.assign(
    {
      notification : false,
      window : []
    },
    meta
  )
}
