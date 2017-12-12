import path from 'path';
import {app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut} from 'electron';
import fs from 'fs';
import * as child_process from 'child_process';
import iconvLite from 'iconv-lite';
import jschardet from 'jschardet';

const defaultimage = path.join(__dirname, '../main.png');
const notificationimage = path.join(__dirname, '../notification.png'); //Native-Image = pngで指定

const isMac = process.platform === 'darwin';

export class CreateWindow{

  constructor(store) {
    this.tray = null;
    this.mainWindow = null;
    this.store = store;
    this.watcher = null;

    this.createTray();
    this.createTrayMenu();

    //this.createWindow();
    this.createMenu();
    // createShortcut(mainWindow, config["shortcut"])


    this.watcherRun(this.store.getState().getIn(['monitor','enable']))
  }

  createTray(){
    this.tray = new Tray(path.join(__dirname, '../main.png'));
    this.tray.setToolTip('UpdateMonitoringWidget');   // 通知領域のアイコンにマウスを載せたときのタイトル
    this.tray.on('click', () => {
        this.tray.setImage(defaultimage);
        var i = this.store.getState().getIn(['monitor','path']);

        child_process.exec(`start ${i}`, (err, stdout, stderr) => {
          if (err) { console.log(err); }
          console.log(stdout);
        });

      // if(this.mainWindow === null){
      //   //createWindow();
      // }else{
      //   this.store.dispatch({type : 'CHANGE_INC'});
      // }
    });
  }

  createWindow(){
    this.mainWindow = new BrowserWindow(
    {
      width: 800,
      height: 600
    });
    this.mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
    this.mainWindow.on('closed', ()=> { this.mainWindow = null });
    this.mainWindow.webContents.openDevTools();
  }

  createTrayMenu(tray, store){
    this.tray.setContextMenu(Menu.buildFromTemplate(
    [
      {
        label: 'RUN',
        type: 'checkbox',
        checked : this.store.getState().getIn(['monitor','enable']),
        click: (e)=> {
          this.store.dispatch({type : 'CHANGE_RUN', payload : e.checked})
          this.watcherRun(e.checked)
        }
      },
      {
        label: 'Setting',
        click: (e)=> {
          this.createWindow();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Exit',
        click (menuItem){ app.quit(); }
      }
    ]));
  }

  createMenu(){
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

  createShortcut(win, obj){
    for(let key in obj["global"]){
      globalShortcut.register(key, () => {
        win.webContents.send(key, obj["global"][key]);
      })
    }
  }

  watcherRun(flag){
    if(flag){
      this.watcher = fs.watch(this.store.getState().getIn(["monitor","path"]), (event, filename)=> {
        //バルーンを上げます
        this.tray.displayBalloon(
          {
            title : `${event}`,
            content :  `${filename}`,
          },
          this.store.getState().getIn(["monitor","displaytime"])
        );
        this.tray.setImage(notificationimage);
        //watcher.close();
      })
    }else{
      this.watcher.close();
      this.watcher = null;
    }
  }
}


/*
fs.readdir(".", (err, files)=>{
  if (err) throw err;
  console.log(files)
  let fileList = files.filter((f)=>{
    //atime	アクセス時間	指定日数内にアクセスされたファイル
    //ctime	作成時間	指定日数内に属性変更されたファイル
    //mtime	修正時間（iノード管理）	指定日数内に修正、更新されたファイル

    var dt = new Date(fs.statSync(f).mtime);
    console.log(dt.toLocaleString())
    return fs.statSync(f).isFile() && /.*\.js$/.test(f);
  })
  console.log(fileList)

  //resolve(files)
});




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
*/
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
      import iconvLite from 'iconv-lite';
      import jschardet from 'jschardet';
      import encoding from 'encoding-japanese';
      var string = encodeURI('日本語');
      //console.log(encodeURIComponent(utf8_text));

      console.log(URLDecoder.decode(string, "shift-jis"))

*/
