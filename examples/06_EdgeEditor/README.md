# EdgeEditor

## プロセスの区別

Electronはディスクトップアプリなので、メインプロセスとレンダープロセスが分離しています。

メインプロセスとレンダープロセスの通信としてipcMain-ipcRendererが用意されているわけですが。Reduxを使用した場合は処理がreducerに集約されるので、両立するためには一工夫必要となります。

1. ipc2reducer
1. 非同期(Redux-Saga)

### 1. ipc2reducer

#### 通常のipc

```javascript
const ipcMain = electron.ipcMain;
//受け(from send)
ipcMain.on("click-my-button", (event, e) => {
    console.log(e);
    event.sender.send('reply', 'pong');//送り
    
});
//受け(from sendsync)
ipcMain.on('sync-message', (event, arg) => {
  console.log(arg)
  event.returnValue = 'pong';//送り
})
```

```javascript
const ipcRenderer = require("electron").ipcRenderer;
//送り
ipcRenderer.send("click-my-button", ++clickCount);
const result = ipcRenderer.sendSync("click-my-button", ++clickCount);
//受け
ipcRenderer.on('reply', (event, arg) => {
    console.log(arg)
})
```

#### 直書き

1. ipcRendererからstore.dispatch呼び出し登録
2. ```mainWindow.webContents.send```でメインプロセスからipc呼び出し

ちょっとむず痒い

```javascript
app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  menu = Menu.buildFromTemplate([{
    label: 'Awesome menu',
    submenu: [{
      label: 'my menu',
      click() {
        mainWindow.webContents.send('my-menu', "hoge");
      }
    }]
  }]);
  Menu.setApplicationMenu(menu);
})
```
```javascript
const store = configureStore();
ipcRenderer.on('my-menu', (event, param) => {
  store.dispatch({ type: 'MY_MENU', param });
});
```

#### redux-electron-ipc

ライブラリのredux-electron-ipcを使用する場合

```javascript
import createIpc, { send } from 'redux-electron-ipc';

const ipc = createIpc({
  'pong': pongActionCreator, // receive a message
  ...
});

const store = createStore(exampleReducer, applyMiddleware(ipc));

store.dispatch(send('ping', 'redux', 'electron', 'ipc'));
```
```javascript
ipcMain.on('ping', (event, ...args) => {
  console.log('Ping', ...args);
  event.sender.send('pong', ...args);
});
```

### 2. 非同期

どこに非同期をおしつけるか。React-Reduxのやり方としては主に3つ。

A. components/containers
B. Action (redux-thunk)
C. Saga (redux-saga)

#### A. components/containers

Logicが分離できないので、同じコードをたくさん書いたり、処理がかぶったときの動作むずい

```javascript
class App extends React.Component {
  onClick() {
    API().then(n => {
      this.props.hoge(n);
    });
  }
  return (
    <div>
      <button onClick={onClick}>next</button>
    </div>
  )
}
```

#### B. Action

middlewareとしてredux-thunkを使用します。

#### C. Saga

middlewareとしてredux-sagaを使用します。sagaは通常の

```
Action -> Reducer -> state
```

というフローに対して、次のようなフローを追加して非同期を実現します

```
Action ┬-----------------┬>Reducer -> state
       └> Saga -> Action ┘
```

Sagaを使用するにはジェネレータ関数を使用する必要があります。Babel的には一例としてpackage.jsonに以下を追加してinstallすることで動作環境を作れます。

```
"babel": {
  "plugins": [
    "transform-regenerator",
    "transform-runtime"
  ]
},
"dependencies": {
  "babel-plugin-transform-regenerator": "^6.26.0",
  "babel-plugin-transform-runtime": "^6.23.0"
}
```
