const path = require('path');
const url = require('url');
const fs = require('fs');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  const configJson = require('../config.json');
  mainWindow = new BrowserWindow({
    title: app.getName(),
    width: configJson["window"]["width"],
    height: configJson["window"]["height"],
    //frame: false,
    //transparent: true
    //kiosk : true //全画面で専用端末画面みたいにできる
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  installMenu();

  //コマンドラインオプションの確認
  if(configJson["window"]["devTool"])
    mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  });
  setShortcut(configJson);
};

app.on('ready', createWindow)

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

process.on('uncaughtException', function (error) {
    console.error(error);
});

function installMenu() {
  const Menu = electron.Menu;

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click () { app.quit(); }
        },
        {
          label: 'PrintPDF',
          accelerator: 'Ctrl+P',
          click () {
            mainWindow.webContents.printToPDF({}, (error, data) => {
              if (error) throw error
              fs.writeFile('print.pdf', data, (error) => {
                if (error) throw error
                console.log('Write PDF successfully.')
              })
            });
          }
        },
        {
          label: 'ExportSVG',
          accelerator: 'Ctrl+S',
          click () {
            mainWindow.webContents.send("SQL_ASYNCLATEST", "SQL_ASYNCLATEST");
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Mermaid',
          type: 'checkbox', checked: true, click (i) { clickViewMenu(i); }
        },{ label: 'Wf Edit',
          type: 'checkbox', checked: false, click (i) { clickViewMenu(i); }
        },{ label: 'Wf Color',
          type: 'checkbox', checked: false, click (i) { clickViewMenu(i); }
        },{ label: 'Wf Mono',
          type: 'checkbox', checked: false, click (i) { clickViewMenu(i); }
        }
      ]
    },
    {
      label: 'Debug',
      submenu: [
        {
          label: 'A',
          click () { mainWindow.webContents.send("SQL_ASYNCLATEST", "SQL_ASYNCLATEST"); }
        }
      ]
    }
  ]));
}

function clickViewMenu(item){
  const menu = electron.Menu.getApplicationMenu();
  menu.items["View"]
  let result = menu.items.filter((i)=>{
    return i.label == 'View';
  })
  result[0].submenu.items.forEach((i)=>{i.checked = false});
  item.checked = true;
  mainWindow.webContents.send("VIEW_CHANGE", item.label);
}

function setShortcut(config){
  const globalShortcut = electron.globalShortcut;
  const registerShortcut = config["shortcut"]["global"];
  for(let key in registerShortcut){
    globalShortcut.register(key, () => {
      mainWindow.webContents.send(key, registerShortcut[key]);
    })
  }
}

/*
const clipboard = require('electron').clipboard; //clipboard
    var btnCopy = document.getElementById("btnCopy");
    btnCopy.onclick = function(){
        clipboard.writeText('Copy!');
    }
//SHELL
    const shell = require('electron').shell;

    shell.openExternal('https://github.com');
    shell.moveItemToTrash('./3rd.html');
//ダイアログ
    const dialog = require('electron').dialog;

    app.on('ready', function() {
    //(ry
      console.log(dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]}));
    //(ry
    });

//右クリックメニュー
const remote = require('electron').remote;
      const Menu = remote.Menu;
      const MenuItem = remote.MenuItem;

      var template = [
      { label: 'Menu-1', click: function() { console.log('item 1 clicked'); } },
      { type: 'separator' },
      { label: 'Menu-2', type: 'checkbox', checked: true},
      { label: 'Menu-3', submenu:[
         {label: 'Sub-Menu-1', accelerator: 'CmdOrCtrl+M'}]}
      ];

      var menu = Menu.buildFromTemplate(template);

      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({ label: 'NewMenu' }));

      window.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      menu.popup(remote.getCurrentWindow());
      }, false);
//メニューバー
const Menu = electron.Menu;
const Tray = electron.Tray;
//(ry
app.on('ready', function() {
//(ry
    appIcon = new Tray('./tri.png');
    var contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ]);
    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);
//(ry
}
*/
