const electron = require('electron');
const fs = require('fs');

exports.exit = function(app) {
  app.quit();
}

exports.printpdf = function(mainWindow) {
  mainWindow.webContents.printToPDF({
    printBackground: true,
    printSelectionOnly: false,
    pageSize: 'A4'
  }, (error, data) => {
    if (error) throw error
    fs.writeFile('print.pdf', data, (error) => {
      if (error) throw error
      // shell.openExternal('file://' + pdfPath) // 書き込みの確認
      // event.sender.send('wrote-pdf', pdfPath) // 報告
      console.log('Write PDF successfully.')
    })
  });
}

exports.clickViewMenu = function(mainWindow, item){
  const menu = electron.Menu.getApplicationMenu();
  menu.items["View"]
  let result = menu.items.filter((i)=>{
    return i.label == 'View';
  })
  result[0].submenu.items.forEach((i)=>{i.checked = false});
  item.checked = true;
  mainWindow.webContents.send("VIEW_CHANGE", item.label);
}
