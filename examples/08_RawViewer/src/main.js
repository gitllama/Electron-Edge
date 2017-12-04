const path = require('path');
const url = require('url');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow;

//コマンドラインオプションの確認, ready前に書かないとコンソール持ってかれる
if(process.argv.indexOf('-H') > 0)
  console.log(`
    Help
     -H : Help
     -D : DevTools
  `);

app.on('ready', function() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
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
  const registerShortcut = require('../shortcut.json');
  for(let key in registerShortcut["global"]){
    globalShortcut.register(key, () => {
      mainWindow.webContents.send(key, registerShortcut["global"][key]);
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
