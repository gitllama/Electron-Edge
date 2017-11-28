# EdgeEditor

## プロセスの区別

Electronはディスクトップアプリなので、メインプロセスとレンダープロセスが分離しています。

メインプロセスとレンダープロセスの通信としてipcMain-ipcRendererが用意されているわけですが。Reduxを使用した場合は処理がreducerに集約されるので、両立するためには一工夫必要となります。

その際のTips。

### 1. ipc2reducer

#### 通常のipc

```javascript
const ipcMain = electron.ipcMain;
ipcMain.on("click-my-button", (sender, e) => {
    console.log(e);
});
```

```javascript
const ipcRenderer = require("electron").ipcRenderer;
ipcRenderer.send("click-my-button", ++clickCount);
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

### 2. ショートカット / メニュー

メインプロセスのelectron.globalShortcutとkeymasterのようなレンダープロセスでのショートカット制御が混在します。  
また、メニューもメインプロセスから追い出したいところ。

### 3. 非同期

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

middlewareとしてredux-sagaを使用します。

Sagaを使用するにはジェネレータ関数を使用する必要がありますが、Babel的には

- babel-plugin-transform-regenerator
- babel-plugin-transform-runtime

と

```
"plugins": [
  "transform-regenerator",
  "transform-runtime"
]
```

の指定が必要
