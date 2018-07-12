const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;

const win = require('./windowManager.js');

exports.createIPC = function(){

  // ipcMain.on('sync-html', ( event, args )=>{
  //   // console.log(subWindow, args)
  //   if(win.subWindow())
  //     win.subWindow().webContents.send('sync-html', args);
  // });

}
