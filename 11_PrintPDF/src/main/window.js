import path from 'path';
import { app, BrowserWindow, Tray, Menu, globalShortcut } from 'electron';
import fs from 'fs';
import * as childProcess from 'child_process';

export class CreateWindow {
  constructor(store) {
    // this.tray = null;
    this.mainWindow = null;
    this.store = store;
    // this.watcher = null;

    this.createMenu();
    this.createWindows();
    // createShortcut(mainWindow, config["shortcut"])
  }

  createWindows() {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });
    this.mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
    this.mainWindow.on('closed', () => { this.mainWindow = null; });
    this.mainWindow.webContents.openDevTools();
  }

  createMenu() {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: 'Menu',
        submenu: [
          {
            label: 'Exit',
            accelerator: 'Ctrl+Q',
            click: () => { app.quit(); },
          },
          {
            label: 'PrintPDF',
            click: () => {
              // this.printWindow = new BrowserWindow({
              //   width: 800,
              //   height: 600,
              // });
              // this.printWindow.loadURL(`file://${path.join(__dirname, '../renderer/print.html')}`);
              // this.printWindow.on('closed', () => { this.printWindow = null; });
              this.mainWindow.webContents.printToPDF({
                printBackground: true,
                printSelectionOnly: false,
                pageSize: 'A4',
              }, (error, data) => {
                if (error) throw error;
                fs.writeFile('test.pdf', data, (e) => {
                  if (e) throw e;
                  // shell.openExternal('file://' + pdfPath) // 書き込みの確認
                  // event.sender.send('wrote-pdf', pdfPath) // 報告
                });
              });
            },
          },
        ],
      },
    ]));
  }

  createShortcut(win, obj) {
    Object.keys(obj.global).forEach((key) => {
      globalShortcut.register(key, () => {
        this.mainWindow.webContents.send(key, obj.global[key]);
      });
    });
  }
}
