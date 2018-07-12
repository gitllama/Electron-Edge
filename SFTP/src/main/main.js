const {app, ipcMain} = require('electron');

const path = require('path');
const url = require('url');

const win = require('./windowManager.js');
const ipc = require('./ipc.js');
const menu = require('./menu.js');

app.on('ready', ()=> {
  createWindow()
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

function createWindow () {

  win.createBrowserWindow(
    app.getName(),
    '../render/index.html',
    win.getConfig()
  )

  menu.createMenu();

  ipc.createIPC();

};
