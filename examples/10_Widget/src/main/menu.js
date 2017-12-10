import electron from 'electron';
import {Menu, app, globalShortcut} from 'electron';

/*
予約 :
 Ctrl+Q

 CmdOrCtrl+W

 globalShortcut.unregisterAll()
*/

export function createMenu(){
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

export function createShortcut(win, obj){
  for(let key in obj["global"]){
    globalShortcut.register(key, () => {
      win.webContents.send(key, obj["global"][key]);
    })
  }
}

export function createTrayMenu(tray){
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
}
