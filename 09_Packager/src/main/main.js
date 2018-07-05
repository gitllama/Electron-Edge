const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');


const win = require('./windowManager.js');
const ipc = require('./ipc.js');
const menu = require('./menu.js');

app.on('ready', ()=> {

  //main基準の絶対パス表記に変換
  // electron.protocol.interceptFileProtocol('file', (req, callback) => {
  //   const requestedUrl = req.url.substr(7);
  //   if (path.isAbsolute(requestedUrl)) {
  //     callback(path.normalize(path.join(__dirname, requestedUrl)));
  //   } else {
  //     callback(requestedUrl);
  //   }
  // });

  createWindow()
  createShortcut();
});

app.on('activate', ()=> {
  if (win.mainWindow() === null) {
    createWindow()
  }
});

app.on('window-all-closed', ()=> {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

process.on('uncaughtException', (error)=> {
    console.error(error);
});


function createShortcut(){
  const globalShortcut = electron.globalShortcut;
  const registerShortcut = win.getConfig()["shortcut"]["global"];
  for(let key in registerShortcut){
    globalShortcut.register(key, () => {
      win.mainWindow().webContents.send(key, registerShortcut[key]);
    })
  }
}


function createWindow () {

  win.createBrowserWindow(
    app.getName(),
    '../render/index.html',
    win.getConfig()
  )

  menu.createMenu();

  ipc.createIPC();

};
