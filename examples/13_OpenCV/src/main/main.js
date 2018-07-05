const {app, ipcMain, BrowserWindow, Menu} = require('electron');

const path = require('path');
const url = require('url');
const fs = require('fs');

class WindowManager {
  constructor(path) {
    this.windowDocker = {}
    const json = fs.readFileSync(path).toString();
    this.configJson = JSON.parse(json);
  }
  mainWindow() {
    return this.windowDocker["main"];
  }
  subWindow() {
    return this.windowDocker["sub"];
  }
  createBrowser(type, title) {
    if(this.windowDocker[type] != null) return;

    let _config = Object.assign({
      title: title,
      webPreferences : {
        additionalArguments : [type]
      }
    }, this.configJson['window']);

    this.windowDocker[type] = new BrowserWindow(_config);
    this.windowDocker[type].loadURL(url.format({
      pathname: path.join(__dirname, '../index.html'),
      protocol: 'file:',
      slashes: true
    }));

    this.windowDocker[type].webContents.on('did-finish-load',()=>{
      this.windowDocker[type].webContents.send('INIT_ASYNCLATEST', this.configJson);
    });
    this.windowDocker[type].on('closed', ()=>{
      this.windowDocker[type] = null
      delete this.windowDocker[type];
    });

    if(type == 'main'){

    }else{

    }
  }
  sendAll(name, arg){
    Object.keys(this.windowDocker).forEach((key)=>{
      this.windowDocker[key].webContents.send(name, arg);
    });
  }
  sendMain(name, arg){
    this.windowDocker['main'].webContents.send(name, arg);
  }
  sendSub(name, arg){
    Object.keys(this.windowDocker).forEach((key)=>{
      if(key != 'main')
        this.windowDocker[key].webContents.send(name, arg);
    });
  }
}
const win = new WindowManager(path.join(__dirname, '../config.json'));

app.on('ready', ()=> {
  createWindow();
  //createShortcut();
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
  win.createBrowser('main', app.getName())
  installMenu();
  // ipc.createIPC(win);
};



function installMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Export CSV',
          click () {
            // Dialog.showSaveDialog(null, {
            //     title: 'Save',
            //     defaultPath: '.',
            //     filters: [
            //         {name: 'CSV', extensions: ['csv']}
            //     ]
            // }, (savedFiles) => { mainWindow.webContents.send("exportCSV",savedFiles); });
          }
        },
        { role: 'toggleDevTools' },   //Shift+Ctrl+I
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click () { app.quit(); }
        }
      ]
    }
  ]));
}
