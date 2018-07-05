const {app,ipcMain} = require('electron');

exports.createIPC = function(win){

  ipcMain.on('sync-html', ( event, args )=>{
    win.sendSub('sync-html', args);
  });

  ipcMain.on('change-title', (event, args) => {
    win.mainWindow().setTitle(`${args} - ${app.getName()}`);
  });

  // ipcMain.on('change-cursor', ( event, args )=>{
  //   if(subWindow)
  //     subWindow.webContents.send('change-cursor', args);
  // });
  //


  // ipcMain.on('save-file', function (event, arg) {
  //   console.log('save-file',arg)
  //   if(arg != null){
  //     mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", arg);
  //   }else{
  //     let dst = electron.dialog.showSaveDialog(null, {
  //       title: 'Save As',
  //       defaultPath: '.',
  //       filters: [
  //           {name: 'markdown file', extensions: ['md']}
  //       ]
  //     });
  //     if(dst !== undefined){
  //       mainWindow.webContents.send("SAVEFILE_ASYNCLATEST", dst);
  //     }
  //   }
  // });
}
