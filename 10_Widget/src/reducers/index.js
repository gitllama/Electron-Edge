import { ipcRenderer, BrowserWindow } from 'electron';
import { reducers } from './logic';

function mergeMeta(meta) {
  return Object.assign(
    {
      meta: {
        notification: false,
      },
    },
    meta,
  );
}

// this.store.dispatch({type : 'CHANGE_INC', meta : { window : [this.mainWindow]}});
// -> BrowserWindow.getAllWindows()

export function mainReducer(state, actionsrc) {
  const action = mergeMeta(actionsrc);
  console.log(`mainAction : ${action.type}, ${action.meta.notification}`);

  // reducersかsagaか判定
  if (reducers[action.type]) {
    // flagの付加、ipc送信(とりあえずすべてのwindowに)
    BrowserWindow.getAllWindows().forEach((element, index) => {
      if (element == null) return;
      element.webContents.send(
        'notification',
        {
          type: action.type,
          payload: action.payload,
          meta: { notification: true },
        },
      );
    });
    return reducers[action.type](state, action);
  }
  return state;
}

export function rendererReducer(state, action) {
  action = mergeMeta(action);
  console.log(`rendererAction : ${action.type}, ${action.meta.notification}`)

  // flagの確認、なかった場合ipc送り
  if (!action.meta.notification) {
    ipcRenderer.send('notification', action);
    return state;
  }

  return reducers[action.type]
    ? reducers[action.type](state, action)
    : state;
}
