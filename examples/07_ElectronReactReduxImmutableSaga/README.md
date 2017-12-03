# ElectronReactReduxImmutableSaga

Redux-Sagaで非同期戦略

redux-actionsは別サンプル参照

## はじめに

sagaは通常の

```
Action -> Reducer -> state
```

というフローに対して、次のようなフローを追加して非同期を実現します

```
Action ┬-----------------┬>Reducer -> state
       └> Saga -> Action ┘
```

ただ順番的にはReducerの処理が終わった後にSagaが実行されている模様なので厳密には次のフローのようで、Sagaの前に必ずStateの更新が起こっていることを留意する必要がある

```
Action ┬>Reducer -> state
  ↑    └------------------> Saga(各taskがActionを監視)
  └--------------------------┘
```


## セッティング

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

## 基本的な文法

index.js
```javascript
import createSagaMiddleware from 'redux-saga'
import { reducer }  from './reducer'
import { rootSaga }  from './saga.js'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)
```

saga.js
```javascript
import { takeEvery, takeLatest, call, put, take, fork } from 'redux-saga/effects'

/*
Actionの呼び出し監視
  take       : アクションを待ち受ける
  takeEvery  : アクションを待ち、呼ばれたらSagaの呼び出し
  takeLatest : タスク実行中の場合呼ばれたら最後の一回だけSaga呼び出し

functionの呼び出し
  fork : 並列に実行（sagaを並列に実行,別のタスクを開始
  call : 直列に実行（Promiseの完了を待つ

結果の伝達
  put : Actionをdispatch

それ以外
  select : stateを取得
  join: 別のタスクの終了を待つ
  あとは https://redux-saga.js.org/docs/api/ 参照
*/

//Saga Monitor

//Aパタン（Actionの監視）
export function* rootSaga() {
  yield takeEvery('REQUEST_DECORD_ASYNC', fetchDecord);
  yield takeLatest('READ_FILE_ASYNC', fetchReadFile);
}

//Bパタン（Actionの監視）
export function* rootSaga() {
  yield fork(handleDecord);
  yield fork(handleReadFile);
}
function* handleDecord() {
  while(true){
    const action = yield take('REQUEST_DECORD_ASYNC');
    yield call(fetchDecord, action.payload);
  }
}
function* handleReadFile() {
  while(true){
    const action = yield take('READ_FILE_ASYNC');
    yield call(
      ((ms)=> new Promise(resolve => setTimeout(resolve, ms))),
      1000
    )
    yield call(fetchReadFile, action.payload);
  }
}

//Cパタン（Stateの監視）
function* river() {
  while (yield select(state => state.get("flag"))) {
    yield put(sing());
    yield call(wait);
  }
}

//Dパタン（複数のSagaの統合
/*
export sagaA itemSagas = [
  takeLatest(AA_AAA, aFlow),
  takeLatest(BB_BBB, BFlow),
]
*/
import sagaA from './sagaA'
import sagaB from './sagaB'
export default function* rootSaga() {
  yield all([
    ...sagaA,
    ...sagaB,
  ])
}

//Saga
export function* fetchReadFile(action) {
  let result = yield call(readfile, action.payload);
  yield put(actions.receiveRaw(result));
}

export function* fetchReadFile(action) {
  const task = yield fork(handleFetchBranchInfoAll, repos);
  yield join(task);
  yield put(actions.receiveRaw(result));
}

//API等
function readfile(params){
  return new Promise((resolve, reject) => {
    resolve(dst);
  });
}
```

## Sagaでの非同期記述とReducerの整理

ActionがSaga、Reducer両方に流れると流れを追うのが大変です。

### Aパタン

ComponentでLogic。Componentに強く依存した動作の場合はありか

### Bパタン

Componentでそれぞれのstate監視。LogicっぽいのがComponentに染み出していていまいち。

```javascript
class Cnv extends React.Component {
  componentDidMount() {
    this.node.ondragover =()=> false;
    this.node.ondragleave = this.node.ondragend = () => false;

    this.node.ondrop = ((e) => {
      e.preventDefault();
      let file = e.dataTransfer.files[0];
      this.props.actions.readFileAsync({
        file : file,
        type : this.props.state.get('type')
      });
      return false;
    }).bind(this);

    this.props.actions.requestDecordAsync(this.props.state);
  }
  componentWillReceiveProps(nextProps){
    const check =(e)=> this.props.state.get(e) != nextProps.state.get(e);
    if(nextProps.state.get('redraw')){
      this.props.actions.requestDecordAsync(this.props.state);
      // this.props.actions.requestDecordAsync({
      //     rawdata : nextProps.state.get('rawdata'),
      //     width : nextProps.state.get('width'),
      //     height : nextProps.state.get('height'),
      //     bitshift : nextProps.state.get('bitshift'),
      //     offset : nextProps.state.get('offset')
      // });      
    }else if(check('imagedata')){
      let context = this.node.getContext('2d');
      context.putImageData(nextProps.state.get('imagedata'), 0, 0);
    }
  }
  render() {
    return (
      <div style={this.props.style}>
        <canvas ref={node => this.node = node}/>
      </div>
    );
  }
}
```

```javascript
function* fetchReadFile(action) {
  let result = yield call(readfile, action.payload);
  yield put(actions.receiveRaw(result));
}
function* fetchDecord(action) {
  let result = yield call(decord, {
    rawdata : action.payload.get('rawdata'),
    width : action.payload.get('width'),
    height : action.payload.get('height'),
    bitshift : action.payload.get('bitshift'),
    offset : action.payload.get('offset')
  });
  yield put(actions.receiveDecord(result));
}
export function* rootSaga() {
  yield takeEvery('REQUEST_DECORD_ASYNC', fetchDecord);
  yield takeEvery('READ_FILE_ASYNC', fetchReadFile);
}
```

### Cパタン

Actionをsagaで受けない。stateを監視

### Dパタン

Actionをすべて一度sagaで受ける  
設計方針としてcomponentsから呼ばれるActionはすべて一度Sagaを経由する作りはあり

```javascript
//UserAction(SystemAction) : ユーザーもしくはシステムが発生させてアクション
//ReducerAction ::Stateの更新のみをつかさどるアクション
export function* rootSaga() {
  yield takeEvery('USER_A', function* (action){
    yield put(actions.reducerA(action.payload));
  });
}
```

## Sagaを使用したショートカット管理

ViewからのアクションだけでなくショートカットやMenuもActionに流れるようにすることで、ロジックを整理できます

```
Menu      ┐
Shortcut  ┼> Action ┬-----------------┬>Reducer -> state
Component ┘         └> Saga -> Action ┘
```

globalShortcutやMenuはメインプロセスで登録しますが、メインプロセスでActionを呼ぶのは無理があるのでipcに頑張ってもらいます

### 実装

- jsonで```キー``` ```アクション名```の連想配列
- globalShortcutは```app.ready('on')```内で実装する必要がある
  - main.js内にjsonに沿ってregister
  - ipcを使用してレンダープロセスに```キー``` ```アクション名```を投げる
- index.js内でstoreの登録と同時にipcRendererの登録
  - ipcRendererからActionに投げる

同様にMenuもActionに関連付けられる

shortcut.json
```javascript
{
  "global" : {
    "ctrl+u" : "SHORTCUT_INC",
  },
  "main" : {
  }
}
```
main.js
```javascript
//app.ready('on')ない
const globalShortcut = electron.globalShortcut;
const registerShortcut = require('../shortcut.json');
for(let key in registerShortcut["global"]){
  globalShortcut.register(key, () => {
    mainWindow.webContents.send(key, registerShortcut["global"][key]);
  })
}
```
index.js
```javascript
const ipcRenderer = require("electron").ipcRenderer;
const registerShortcut = require('../shortcut.json');
for(let key in registerShortcut["global"]){
  ipcRenderer.on(key, (event, param) => {
    store.dispatch({type: param});
  });
}
```
