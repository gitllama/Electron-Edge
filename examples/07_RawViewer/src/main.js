const path = require('path');
const url = require('url');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow;

//コマンドラインオプションの確認
//app.on('ready')に書かないと出力が奪われてコンソールにでない
console.log('args: ', process.argv);

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
    installMenu();

    if(process.argv.indexOf('-D') > 0)
      mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    });

    setShortcut();

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

function installMenu() {
  const Menu = electron.Menu;
  // Win/Macではkeyが違うので
  // if(process.platform == 'darwin') で分ける必要あり
  // 追加はmainWindow.setMenu(menu);
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click () { app.quit(); }
        }
      ]
    }
  ]));
}

function setShortcut(){
  const globalShortcut = electron.globalShortcut;
  // globalShortcut.register('CommandOrControl+X', () => {
  //   console.log('CommandOrControl+X is pressed');
  // })
  // globalShortcut.register('ctrl+q', () => {
  //   console.log('bye!');
  //   app.quit();
  // })
}
