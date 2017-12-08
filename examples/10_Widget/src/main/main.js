const path = require('path');
const url = require('url');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Tray = electron.Tray;
const Menu = electron.Menu;
const fs = require('fs');

let mainWindow;
let tray;
const flag = true;
let count = 0;
/*ロジック*/
const store = {}
ipcMain.on('store', (event, arg) =>{ event.returnValue = store; });

//引数取れない
exports.A = (e) => {
  count = 0;
}

//コマンドラインオプションの確認, ready前に書かないとコンソール持ってかれる
if(process.argv.indexOf('-H') > 0)
  console.log(`
    Help
     -H : Help
     -D : DevTools
  `);


//設定値の読み込み, globalなのでGCされない
let config = setConfig();
ipcMain.on('config', (event, arg) =>{ event.returnValue = config; });

app.on('ready', ()=> {
  setMenu();
  setTry();
  createWindow();

  countUp().then(() => {
    console.log("end2")
  });

});
app.on('window-all-closed', ()=> {
  if (process.platform !== 'darwin') {
    //app.quit()
  }
});
app.on('activate', ()=> {
  if (mainWindow === null) {
    createWindow()
  }
});

/**/

let filenamesbuf = "";
async function countUp() {
  while (flag) {
    await ((t)=>new Promise(resolve => setTimeout(resolve, t)))(5000);
    let aaa = await ((t)=>new Promise(resolve => {
      fs.readdir(t, (err, files)=>{
        if (err) throw err;
        console.log(files)
        resolve(files)
      });
    }))("C:/Users/PC/Desktop/a");

//一覧とってさいしんタイムスタンプだけ見たほうが効率的
    if(filenamesbuf != aaa){
      filenamesbuf = aaa;
      tray.displayBalloon({
        title : "test",
        content :  `${filenamesbuf}`,
      },3000);

    }
  }
  console.log('end');
}

function setConfig(){
  let defaultConfig = require(path.join(__dirname, '../defaultConfig.json'));
  try{
    return Object.assign(
      defaultConfig,
      require(path.join(path.dirname(process.argv[0]), 'config.json'))
    );
  }catch(e){
    return defaultConfig;
  }
}

function createWindow(){
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    //frame: false,
    //transparent: true
    //kiosk : true //全画面で専用端末画面みたいにできる
    icon : path.join(__dirname, '../main.png') //Native-Image = pngで指定
  });

  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../renderer/index.html'),
      protocol: 'file:',
      slashes: true
  }));
  mainWindow.on('closed', ()=> { mainWindow = null });

  //コマンドラインオプションの確認
  mainWindow.webContents.openDevTools();

  //setShortcut
  const globalShortcut = electron.globalShortcut;
  for(let key in config["shortcut"]["global"]){
    globalShortcut.register(key, () => {
      mainWindow.webContents.send(key, config["shortcut"]["global"][key]);
    })
  }
}

function setMenu(){
  // Win/Macではkeyが違うので
  // if(process.platform == 'darwin') で分ける必要あり
  // 追加はmainWindow.setMenu(menu);
  Menu.setApplicationMenu(Menu.buildFromTemplate(
  [
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

function setTry(){
  //タスクトレイ
  //マルチプラットフォームならClickedイベントは使わないが吉
  tray = new Tray(path.join(__dirname, '../main.png'));
  tray.setContextMenu(Menu.buildFromTemplate(
  [
    {
      label: '新規記事',
      click (menuItem){ subWindow() }
    },
    {
      type: 'separator'
    },
    {
      label: 'Exit',
      click (menuItem){ app.quit(); }
    }
  ]));
  // 通知領域のアイコンにマウスを載せたときのタイトル
  tray.setToolTip('RedmineWidget')
  //マルチプラットフォームならClickedイベントは使わないが吉
  tray.on('click', () => {
    if(mainWindow === null){
      tray.setImage(path.join(__dirname, '../main.png'))
      createWindow()
    }
  })
  //for Windows
  ipcMain.on("displayBalloon", (event, e) => {
    tray.setImage(path.join(__dirname, '../notification.png'));
    tray.displayBalloon({
      title : e.title,
      content : e.content,
    },e.wait);
  });
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

*/
