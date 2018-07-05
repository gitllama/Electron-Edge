const electron = require('electron');
const app = electron.app;
const path = require('path');
const url = require('url');

let mainWindow;
const configJson = require('../config.json');
const ml = require('./mainlogic.js');


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

  createShortcut();

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('INIT_ASYNCLATEST', configJson);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });

};


function createBrowserWindow () {

  mainWindow = new electron.BrowserWindow({
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
  const Menu = electron.Menu;

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click () { ml.exit(app); }
        },
        {
          label: 'FileOpen',
          click () {
            let filenames = electron.dialog.showOpenDialog(null, {
                properties: ['openFile'],
                title: 'Select a text file',
                defaultPath: '.',
                filters: [
                    {name: 'text file', extensions: ['txt']}
                ]
            });
          }
        },
        {
          label: 'DatalogDirectoryOpen',
          click () {
            let dst = electron.dialog.showOpenDialog(null, {
                properties: ['openDirectory'], //multiSelections
                title: 'DatalogDirectoryOpen',
                defaultPath: '.'
            });
            mainWindow.webContents.send("READLOG_ASYNCLATEST", dst);
          }
        },
        {
          label: 'PrintPDF',
          accelerator: 'Ctrl+P',
          click () { ml.printpdf(mainWindow); }
        },
        {
          label: 'ExportSVG',
          accelerator: 'Ctrl+S',
          click () {
            mainWindow.webContents.send("EXPORTSVG_ASYNCLATEST", "");
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'MAIN',
          type: 'checkbox',
          checked: true,
          click (i) { ml.clickViewMenu(mainWindow, i); }
        },{ label: 'A4',
          type: 'checkbox',
          checked: false,
          click (i) { ml.clickViewMenu(mainWindow, i); }
        },{ label: 'Wf Color',
          type: 'checkbox',
          checked: false,
          click (i) { ml.clickViewMenu(mainWindow, i); }
        },{ label: 'Wf Mono',
          type: 'checkbox',
          checked: false,
          click (i) { ml.clickViewMenu(mainWindow, i); }
        }
      ]
    },
    {
      label: 'Debug',
      submenu: [
        {
          label: 'READ WELCOME',
          click () { mainWindow.webContents.send(
            "READWELCOME_ASYNCLATEST",
            `${configJson["data"]["path"]}/welcome.md`
          );}
        },
        {
          label: 'READ SQL',
          click () { mainWindow.webContents.send(
            "READSQL_ASYNCLATEST",
            `${configJson["data"]["path"]}/DB.db`
           ); }
        },

        {
          label: 'READTEST_ASYNCLATEST',
          click () { mainWindow.webContents.send("READTEST_ASYNCLATEST", "READTEST_ASYNCLATEST"); }
        }
      ]
    }
  ]));
}

function createShortcut(){
  const globalShortcut = electron.globalShortcut;
  const registerShortcut = configJson["shortcut"]["global"];
  for(let key in registerShortcut){
    globalShortcut.register(key, () => {
      mainWindow.webContents.send(key, registerShortcut[key]);
    })
  }
}

function createIPC(){
  // electron.ipcMain.on('async', function( event, args ){
  //   mainWindow.webContents.send('return', configJson);
  // });
}

// const clipboard = electron.clipboard;

function createByShell(){

  // const shell = electron.shell;
  // shell.openExternal('https://github.com');
  // shell.moveItemToTrash('./3rd.html');

}

function createRemote(){
  //右クリックメニュー
  // const remote = electron.remote;
  // const Menu = remote.Menu;
  // const MenuItem = remote.MenuItem;
  //
  // let template = [
  //   { label: 'Menu-1', click: function() { console.log('item 1 clicked'); } },
  //   { type: 'separator' },
  //   { label: 'Menu-2', type: 'checkbox', checked: true},
  //   { label: 'Menu-3', submenu:[
  //   {label: 'Sub-Menu-1', accelerator: 'CmdOrCtrl+M'}]}
  // ];
  //
  // var menu = Menu.buildFromTemplate(template);
  //
  // menu.append(new MenuItem({ type: 'separator' }));
  // menu.append(new MenuItem({ label: 'NewMenu' }));
  //
  // window.addEventListener('contextmenu', function (e) {
  //   e.preventDefault();
  //   menu.popup(remote.getCurrentWindow());
  // }, false);
}

function createTray(){
  //メニューバー
  // const Menu = electron.Menu;
  // const Tray = electron.Tray;
  // app.on('ready', function() {
  //     appIcon = new Tray('./tri.png');
  //     var contextMenu = Menu.buildFromTemplate([
  //         { label: 'Item1', type: 'radio' },
  //         { label: 'Item2', type: 'radio' },
  //         { label: 'Item3', type: 'radio', checked: true },
  //         { label: 'Item4', type: 'radio' }
  //     ]);
  //     appIcon.setToolTip('This is my application.');
  //     appIcon.setContextMenu(contextMenu);
  // }

}
