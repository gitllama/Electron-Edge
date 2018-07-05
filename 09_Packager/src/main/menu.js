const electron = require('electron');
const win = require('./windowManager.js');
const app = electron.app;
const logic = require('./logic.js');

exports.createMenu = function() {
  const Menu = electron.Menu;

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'FileOpen',
          accelerator: 'CmdOrCtrl+O',
          click () {
            let dst = electron.dialog.showOpenDialog(null, {
                properties: ['openFile'],
                title: 'Select a Markdown file',
                defaultPath: '.',
                filters: [
                    {name: 'markdown file', extensions: ['md']}
                ]
            });
            if(dst)
              win.mainWindow().webContents.send("READFILE_ASYNCLATEST", dst[0]);
          }
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click () { win.mainWindow().webContents.send("SAVEFILE_ASYNCLATEST", null); }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click () { logic.savefileas(win.mainWindow()) }
        },
        { type: 'separator' },
        {
          label: 'PrintPDF',
          accelerator: 'CmdOrCtrl+P',
          click () { logic.printpdf(win.mainWindow()); }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click () { app.quit(); }
        }
      ]
    },
    {
      label: 'Memory',
      submenu: [
        {
          label: 'IGXL_DatalogOpen',
          click () {
            let dst = electron.dialog.showOpenDialog(null, {
                properties: ['openFile', 'multiSelections'],
                title: 'Select a txt file',
                defaultPath: '.',
                filters: [
                    {name: 'txt file', extensions: ['txt']}
                ]
            });
            if(dst)
              win.mainWindow().webContents.send("READDATALOG_ASYNCLATEST", dst);
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },             //Ctrl+Z
        { role: 'redo' },             //Ctrl+Y
        { type: 'separator' },
        { role: 'cut' },              //Ctrl+X
        { role: 'copy' },             //Ctrl+C
        { role: 'paste' },            //Ctrl+V
        { role: 'selectall' }         //Ctrl+A
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Editor',
          type: 'checkbox',
          checked: true,
          click (i) { clickViewMenu(i); }
        },
        {
          label: 'Split',
          type: 'checkbox',
          checked: false,
          click (i) { clickViewMenu(i); }
        },
        {
          label: 'Preview',
          type: 'checkbox',
          checked: false,
          click (i) { clickViewMenu(i); }
        },
        { type: 'separator' },
        {
          label: 'Open SubWindow',
          click () { win.createBrowserSubWindow("Preview", '../render/index_sub.html', win.getConfig()); }
        },
        { role: 'toggleDevTools' }   //Shift+Ctrl+I
      ]
    },
    {
      label: 'Preview',
      submenu: [
        {
          label: 'Default',
          type: 'checkbox',
          checked: true,
          click (i) { clickPreviewMenu(i); }
        },
        {
          label: 'A4',
          type: 'checkbox',
          checked: false,
          click (i) { clickPreviewMenu(i); }
        },
        {
          label: 'Slide',
          type: 'checkbox',
          checked: false,
          click (i) { clickPreviewMenu(i); }
        },
        {
          label: 'Memory',
          type: 'checkbox',
          checked: false,
          click (i) { clickPreviewMenu(i); }
        },
        { type: 'separator' },
        {
          label: 'Next',
          accelerator: 'Alt+N',
          click (i) { win.sendAll('page-change', 1); }
        },
        {
          label: 'Back',
          accelerator: 'Alt+B',
          click (i) { win.sendAll('page-change', -1); }
        },
        { type: 'separator' },
        { role: 'togglefullscreen' }, //F11
        {
          label: 'Redraw',
          accelerator: 'CmdOrCtrl+R',
          click (i) { logic.redraw(); }
        }
      ]
    },
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
  win.sendMain("view-change", item.label);
}

function clickPreviewMenu(item){
  const menu = electron.Menu.getApplicationMenu();
  menu.items["Preview"]
  let result = menu.items.filter((i)=>{
    return i.label == 'Preview';
  })
  result[0].submenu.items.forEach((i)=>{i.checked = false});
  item.checked = true;
  win.sendAll("preview-change", item.label);
}
