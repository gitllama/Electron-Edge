const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// const configJson = require('../../config.json');
const configJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')));

let mainWindow;

exports.mainWindow = function() { return mainWindow };
exports.getConfig = function() { return configJson };

exports.sendMain = function(name, arg) {
  let args = Array.prototype.slice.call(arguments);
  Reflect.apply(
    mainWindow.webContents.send,
    mainWindow.webContents,
    args
  )
}

exports.sendSub = function(name, arg) {
  if(subWindow)
    subWindow.webContents.send(name, arg);
}
exports.sendAll = function(name, arg) {
  if(mainWindow)
    mainWindow.webContents.send(name, arg);
  if(subWindow)
    subWindow.webContents.send(name, arg);
}

exports.createBrowserWindow = function(title, indexpath, config) {

  mainWindow = new electron.BrowserWindow({
    title: title,
    width: config["window"]["width"],
    height: config["window"]["height"],
    //frame: false,
    //transparent: true
    kiosk : config["window"]["kiosk"] || false //全画面で専用端末画面みたいにできる
  });

  mainWindow.loadURL(url.format({
    pathname:path.join(__dirname, indexpath),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('INIT_ASYNCLATEST', config);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  return;
}
