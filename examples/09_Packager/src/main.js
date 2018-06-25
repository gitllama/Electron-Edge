const {app, Menu, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
const configJson = require('../config.json');


app.on('ready', function() {
  createWindow()
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

process.on('uncaughtException', function (error) {
    console.error(error);
});


function createWindow () {

  createBrowserWindow();

  if(configJson["window"]["devTool"])
    mainWindow.webContents.openDevTools();

  createMenu();

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('INIT_ASYNCLATEST', configJson);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });

};


function createBrowserWindow () {

  mainWindow = new BrowserWindow({
    title: app.getName(),
    width: configJson["window"]["width"],
    height: configJson["window"]["height"],
    //frame: false,
    //transparent: true
    kiosk : configJson["window"]["kiosk"] || false //全画面で専用端末画面みたいにできる
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/print.html')}`);
};

function createMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click () {   }
        }
      ]
    }
  ]));
}
