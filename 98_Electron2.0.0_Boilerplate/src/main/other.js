// const clipboard = electron.clipboard;

// function createShortcut(){
//   const globalShortcut = electron.globalShortcut;
//   const registerShortcut = win.getConfig()["shortcut"]["global"];
//   for(let key in registerShortcut){
//     globalShortcut.register(key, () => {
//       win.mainWindow().webContents.send(key, registerShortcut[key]);
//     })
//   }
// }


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


//
// exports.sendMain = function(name, arg) {
//   let args = Array.prototype.slice.call(arguments);
//   Reflect.apply(
//     mainWindow.webContents.send,
//     mainWindow.webContents,
//     args
//   )
// }
