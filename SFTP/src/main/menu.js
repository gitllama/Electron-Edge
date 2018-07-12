const electron = require('electron');
const win = require('./windowManager.js');
const app = electron.app;

exports.createMenu = function() {
  const Menu = electron.Menu;

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click () { app.quit(); }
        }
      ]
    },
    {
      label: 'SFTP',
      submenu: [
        {
          label: 'Connect',
          click () {
              win.mainWindow().webContents.send("CONNECT_ASYNCLATEST");
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'togglefullscreen' }, //F11
        { role: 'toggleDevTools' }   //Shift+Ctrl+I
      ]
    }
  ]));
}
