import path from 'path';
import {app, BrowserWindow, ipcMain, Tray, Menu} from 'electron';
import {createMenu, createShortcut, createTrayMenu} from './menu'
import Immutable from 'immutable';
//import {configState} from '../defaultState';
import { reducer } from './reducers';
import { createStore } from 'redux'

//設定値の読み込み, globalなのでGCされない
let mainWindow;
let tray;
const state = Immutable.Map({
  count : 3,
  monitor : {
    interval : 10000,
    enable : true
  },
  shortcut : {
    global : {
      "ctrl+u" : "COMMAND_MESSAGE"
    },
    main : {
    }
  },
  window : {
    width: 800,
    height: 600,
    //frame: false,
    //transparent: true
    //kiosk : true //全画面で専用端末画面みたいにできる
    //icon : path.join(__dirname, '../main.png') //Native-Image = pngで指定
  },
  params : Immutable.Map( {
    count : 3
  })
});

/********************/
const store = createStore(
  reducer,
  state
);
const callaction =(action)=>{
  store.dispatch(action);
  //mainWindow.webContents.send('action', action);
  mainWindow.webContents.send('notification');
  console.log(store.getState().get("count"))
}
ipcMain.on('state', (event, arg) =>{ event.returnValue = store.getState().toJS(); });

ipcMain.on('get', (event, arg) =>{
  event.returnValue = store.getState().get(arg);
});
ipcMain.on('action', (event, arg) =>{
  store.dispatch(arg);
});
/********************/

app.on('ready', ()=> {

  tray = new Tray(path.join(__dirname, '../main.png'));
  tray.setToolTip('RedmineWidget');   // 通知領域のアイコンにマウスを載せたときのタイトル
  tray.on('click', () => {
    if(mainWindow === null){
      //tray.setImage(path.join(__dirname, '../main.png'))
      //store.dispath{}
      //createWindow();
    }else{
      callaction({ type:'INC'});
    }
  })
  createWindow();

  // createMenu();
  // createShortcut(mainWindow, config["shortcut"])
  // createTrayMenu(tray)

  // countUp().then(() => {
  //   console.log("end2")
  // });

});

app.on('window-all-closed', ()=> {
  if (process.platform !== 'darwin') {
    //app.quit()
  }
});

app.on('activate', ()=> {
  if (mainWindow === null) {
    createWindow()
  }
});

function createWindow(){
  mainWindow = new BrowserWindow(state.get("window"));
  mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
  mainWindow.on('closed', ()=> { mainWindow = null });
  mainWindow.webContents.openDevTools();
}
