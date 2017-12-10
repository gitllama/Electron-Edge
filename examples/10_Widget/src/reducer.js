const ipcRenderer = require("electron").ipcRenderer;

//const initialState = ipcRenderer.sendSync('state');


const reducers = Object.assign(
  {
    ['STATE_CHANGE'] : (state, action) => (
      action.payload(state)
    )
  }
);

export function mainReducer(state, action, win) {
  console.log(`mainAction : ${action.type}`)
  if(action.type.indexOf("*" > 0)){
    return reducers[action.type.replace("*", "")]
      ? reducers[action.type.replace("*", "")](state, action)
      : state;
  }else{
    win.webContents.send(
      'notification',
      {
        type : "*" + action.type,
        payload : action.payload,
        meta : action.meta
      }
    );
    return reducers[action.type]
      ? reducers[action.type](state, action)
      : state;
  }
}

export function rendererReducer(state, action) {
  console.log(`rendererAction : ${action.type}`)
  if(action.type.indexOf("*" > 0)){
    return reducers[action.type.replace("*", "")]
      ? reducers[action.type.replace("*", "")](state, action)
      : state;
  }else{
    ipcRenderer.send(
      'notification',
      {
        type : "*" + action.type,
        payload : action.payload,
        meta : action.meta
      }
    );
    return reducers[action.type]
      ? reducers[action.type](state, action)
      : state;
  }
}
