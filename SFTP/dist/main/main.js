module.exports=function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=7)}([function(e,n){e.exports=require("electron")},function(e,n,t){"use strict";const o=t(0),r=t(3),i=t(2),u=t(6),c=JSON.parse(u.readFileSync(r.join(__dirname,"../config.json")));let l;n.mainWindow=function(){return l},n.getConfig=function(){return c},n.sendMain=function(e,n){let t=Array.prototype.slice.call(arguments);Reflect.apply(l.webContents.send,l.webContents,t)},n.sendSub=function(e,n){subWindow&&subWindow.webContents.send(e,n)},n.sendAll=function(e,n){l&&l.webContents.send(e,n),subWindow&&subWindow.webContents.send(e,n)},n.createBrowserWindow=function(e,n,t){(l=new o.BrowserWindow({title:e,width:t.window.width,height:t.window.height,kiosk:t.window.kiosk||!1})).loadURL(i.format({pathname:r.join(__dirname,n),protocol:"file:",slashes:!0})),l.webContents.on("did-finish-load",function(){l.webContents.send("INIT_ASYNCLATEST",t)}),l.on("closed",function(){l=null})}},function(e,n){e.exports=require("url")},function(e,n){e.exports=require("path")},function(e,n,t){"use strict";const o=t(0),r=t(1),i=o.app;n.createMenu=function(){const e=o.Menu;e.setApplicationMenu(e.buildFromTemplate([{label:"Menu",submenu:[{label:"Exit",accelerator:"CmdOrCtrl+Q",click(){i.quit()}}]},{label:"SFTP",submenu:[{label:"Connect",click(){r.mainWindow().webContents.send("CONNECT_ASYNCLATEST")}}]},{label:"View",submenu:[{role:"togglefullscreen"},{role:"toggleDevTools"}]}]))}},function(e,n,t){"use strict";const o=t(0);o.ipcMain,o.app,t(1);n.createIPC=function(){}},function(e,n){e.exports=require("fs")},function(e,n,t){"use strict";const{app:o,ipcMain:r}=t(0),i=(t(3),t(2),t(1)),u=t(5),c=t(4);function l(){i.createBrowserWindow(o.getName(),"../render/index.html",i.getConfig()),c.createMenu(),u.createIPC()}o.on("ready",()=>{l()}),o.on("activate",()=>{null===i.mainWindow()&&l()}),o.on("window-all-closed",()=>{"darwin"!==process.platform&&o.quit()}),process.on("uncaughtException",e=>{console.error(e)})}]);