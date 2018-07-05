const {app, Menu, dialog} = require('electron');
const logic = require('./logic.js');

exports.createMenu = function(win) {

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'FileOpen',
          accelerator: 'CmdOrCtrl+O',
          click () {
            let dst = dialog.showOpenDialog(null, {
                properties: ['openFile'],
                title: 'Select a Markdown file',
                defaultPath: '.',
                filters: [
                    {name: 'markdown file', extensions: ['md','adoc']}
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
          click () { win.sendMain("SAVEFILE_ASYNCLATEST", null); }
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
        {
          label: 'PrintHTML',
          accelerator: 'CmdOrCtrl+P',
          click () {
            let dst = dialog.showSaveDialog(null, {
              title: 'Save As',
              defaultPath: '.',
              filters: [
                  {name: 'html file', extensions: ['html']}
              ]
            });
            if(dst){
              win.sendMain('print-html', dst);
            }
          }
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
            let dst = dialog.showOpenDialog(null, {
                properties: ['openFile', 'multiSelections'],
                title: 'Select a txt file',
                defaultPath: '.',
                filters: [
                    {name: 'txt file', extensions: ['txt']}
                ]
            });
            if(dst)
              win.sendMain("READDATALOG_ASYNCLATEST", dst);
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
          click (i) { clickViewMenu(win, i); }
        },
        {
          label: 'Split',
          type: 'checkbox',
          checked: false,
          click (i) { clickViewMenu(win, i); }
        },
        {
          label: 'Preview',
          type: 'checkbox',
          checked: false,
          click (i) { clickViewMenu(win, i); }
        },
        { type: 'separator' },
        {
          label: 'Open SubWindow',
          click () { win.createBrowser("sub", "preview", null); }
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
          click (i) { clickPreviewMenu(win, i); }
        },
        {
          label: 'A4',
          type: 'checkbox',
          checked: false,
          click (i) { clickPreviewMenu(win, i); }
        },
        {
          label: 'Slide',
          type: 'checkbox',
          checked: false,
          click (i) { clickPreviewMenu(win, i); }
        },
        {
          label: 'Memory',
          type: 'checkbox',
          checked: false,
          click (i) { clickPreviewMenu(win, i); }
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



function clickViewMenu(win, item){
  const menu = Menu.getApplicationMenu();
  menu.items["View"]
  let result = menu.items.filter((i)=>{
    return i.label == 'View';
  })
  result[0].submenu.items.forEach((i)=>{i.checked = false});
  item.checked = true;
  win.sendMain("view-change", item.label);
}

function clickPreviewMenu(win, item){
  const menu = electron.Menu.getApplicationMenu();
  menu.items["Preview"]
  let result = menu.items.filter((i)=>{
    return i.label == 'Preview';
  })
  result[0].submenu.items.forEach((i)=>{i.checked = false});
  item.checked = true;
  win.sendAll("preview-change", item.label);
}
