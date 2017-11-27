const path = require('path');
const url = require('url');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const globalShortcut = electron.globalShortcut;

var mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      //frame: false,
      //transparent: true
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: 'Menu',
        submenu: [
          {
            label: 'Google',
            click () { mainWindow.loadURL('https://www.google.co.jp/'); }
          }
        ]
      }
    ]));

    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null
    });

    globalShortcut.register('CommandOrControl+X', () => {
      console.log('CommandOrControl+X is pressed')
    })
    globalShortcut.register('ctrl+q', () => {
      console.log('bye!');
    	app.quit();
    })
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
});
