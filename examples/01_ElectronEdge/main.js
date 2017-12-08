const electron = require('electron')

// Module to control application life.
// Module to create native browser window.
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');
const edge = require('electron-edge-js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//edge

var sample1 = edge.func(function () {/*
   async (input) => "Hello " + input.ToString() + "!";
*/});
sample1('Edge', (error, result)=>{
   if (error) throw error;
   console.log(result);
});

var ElectronDLL = edge.func('ElectronDLL.dll');

ipcMain.on("click-my-button", (sender, e) => {
  ElectronDLL(e, function (error, result) {
    if (error) throw error;
    console.log(result);
  });
});

var ElectronDLL2 = edge.func({
    source: function() {/*
        using System;
        using System.Threading.Tasks;
        using System.Reflection;

        public class Startup
        {
            public async Task<object> Invoke(object input)
            {
              Type type = typeof(ElectronDLL.Helper);
              MemberInfo[] members = type.GetMembers();
              foreach (MemberInfo m in members)
              {
                  Console.WriteLine("{0} - {1}", m.MemberType, m.Name);
              }

              MethodInfo methodinfo = type.GetMethod(((dynamic)input).Method);
              return methodinfo.Invoke(null, ((dynamic)input).parameters);
            }
        }
    */},
    references: [
      'ElectronDLL.dll'
    ]
});

ipcMain.on("click-my-button2", (sender, e) => {
  ElectronDLL2({Method : "HelloCsharp", parameters : [e]}, function (error, result) {
  	if (error) throw error;
  	console.log(result);
  });
});
