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

export function setIpc(win, tray){

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
