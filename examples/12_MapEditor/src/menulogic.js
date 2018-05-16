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


// this.printWindow = new BrowserWindow({
//   width: 800,
//   height: 600,
// });
// this.printWindow.loadURL(`file://${path.join(__dirname, '../renderer/print.html')}`);
// this.printWindow.on('closed', () => { this.printWindow = null; });