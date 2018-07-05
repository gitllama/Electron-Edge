//重い処理はBrowserProcessで動かして、RendererProcessからremoteモジュール経由でアクセスする
/*
const {BrowserWindow} = require('electron').remote
let win = new BrowserWindow({width: 800, height: 600})
win.loadURL('https://github.com')
//これでサブウインドウ開ける
require('electron').remote.getCurrentWindow().on('close', () => {
  // window was closed...
})
*/

//mainプロセスの変更できる
// const hoge = require('electron').remote.require('../main/main')
// hoge.A(0)


// const config = ipcRenderer.sendSync('config')
// for(let key in config["shortcut"]["global"]){
//   ipcRenderer.on(key, (event, param) => {
//     store.dispatch({type: param});
//   });
// }

import {ipcMain} from 'electron';
import {configState} from '../defaultState';

//config = setConfig(config);
function setConfig(src){
  try{
    let buf = require(path.join(path.dirname(process.argv[0]), 'config.json'));
    return Object.assign(
      src,
      require(path.join(path.dirname(process.argv[0]), 'config.json'))
    );
  }catch(e){
    return src;
  }
}

function setIpc(win, tray){

  ipcMain.on('getStore', (event, arg) =>{ event.returnValue = state.ToJS(); });
  ipcMain.on('setStore', (event, arg) =>{ arg });


  //for Windows
  /*
  //レンダーからバルーン呼ぶことはないので必要ない
  ipcMain.on("displayBalloon", (event, e) => {
    tray.setImage(path.join(__dirname, '../notification.png'));
    tray.displayBalloon({
      title : e.title,
      content : e.content,
    },e.wait);
  });
  */

  /*ロジック*/
  const store = {}
  ipcMain.on('store', (event, arg) =>{ event.returnValue = store; });
  //引数取れない
  exports.A = (e) => {
    count = 0;
  }

  ipcMain.on('config', (event, arg) =>{ event.returnValue = config; });
}
