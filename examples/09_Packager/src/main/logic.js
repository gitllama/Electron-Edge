const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const fs = require('fs');
const win = require('./windowManager.js');

exports.printpdf = function(mainWindow) {
  let dst = electron.dialog.showSaveDialog(null, {
    title: 'Save As',
    defaultPath: '.',
    filters: [
        {name: 'pdf file', extensions: ['pdf']}
    ]
  });
  if(dst !== undefined){
    mainWindow.webContents.printToPDF({
      marginsType : 1, // Uses 0 for default margin, 1 for no margin, and 2 for minimum margin.
      printBackground: false,
      printSelectionOnly: false,
      pageSize: 'A4',
      //landscape : false 横長
    }, (error, data) => {
      if (error) throw error
      fs.writeFile(dst, data, (error) => {
        if (error) throw error
        // shell.openExternal('file://' + pdfPath) // 書き込みの確認
        // event.sender.send('wrote-pdf', pdfPath) // 報告
        console.log('Write PDF successfully.')
      })
    });
  }
}


exports.savefileas = function(mainWindow){
  let dst = electron.dialog.showSaveDialog(null, {
    title: 'Save As',
    defaultPath: '.',
    filters: [
        {name: 'markdown file', extensions: ['md']}
    ]
  });
  if(dst !== undefined){
    mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", dst);
  }
}


exports.redraw = function(){
  //win.sendAll("preview-change", null);
  const menu = electron.Menu.getApplicationMenu();
  let result = menu.items.filter((i)=>{
    return i.label == 'Preview'
  });
  let dst = result[0].submenu.items.filter((i)=>{
    return i.checked == true;
  });
  win.sendAll("preview-change", dst[0].label);
  win.sendMain("redraw");
}
