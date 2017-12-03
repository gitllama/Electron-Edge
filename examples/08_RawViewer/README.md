# RawViewer

## future

ショートカットのjsonへのきりだし

## redux-actions

redux-actionsでFSA(Flux Standard Action)ガイドラインに沿ったつくりにします

本来、オブジェクト構造は

```
{
  type: string;
  payload?: any;
  error?: boolean;
  meta?: any;
}
```

のようですがerrorは未実装の様子

### actions

```javascript
import { createAction } from 'redux-actions';
//createAction(type)
//createAction(type, payloadCreator)
//createAction(type, payloadCreator, metaCreator)

export const hoge = createAction('HOGE');
export const hoge2 = createAction('HOGE2', amount => amount + 1);

/*
hoge() -> { type: 'HOGE' }
hoge(10) > { type: 'HOGE', payload: 10 }
hoge2(10) > { type: 'HOGE2', payload: 11 }
*/
```

```javascript
const { createActions, handleActions } from 'redux-actions';
//createActions(actionMap)
//createActions(actionMap, ...identityActions)

const { increment1, decrement1 } = createActions('INCREMENT1', 'DECREMENT1');
const { increment, decrement } = createActions({
  'INCREMENT': amount => ({ amount: 1 }),
  'DECREMENT': amount => ({ amount: -1 })
});
const { increment2 } = createActions({
  'INCREMENT2':[
     amount => ({ todo }), // payload creator
     (todo,warn) => ({todo,warn}) // meta
});
```

横着モノには自動でActionCreater命名

```javascript
export default createActions(
    'REQUEST_LIST',　// -> requestList()
    'REQUEST_DECORD',// -> requestDecord()
);
```

### reducer

redux-actionsでreducerはhandleAction, handleActionsで作成することができる

が、プログラム内ではfunction reducer内で共通処理書いているのでとりええずそのまま

```javascript
//handleAction(type, reducer, defaultState)
//handleAction(type, reducerMap, defaultState)
//handleActions(reducerMap, defaultState)

const reducer = handleActions({
  [increment](state, { payload: { amount } }) {
    return { counter: state.counter + amount }
  },
  [decrement](state, { payload: { amount } }) {
    return { counter: state.counter + amount }
  }
}, defaultState);

const reducer = handleActions({
  INCREMENT: (state, action) => ({
    counter: state.counter + action.payload
  }),

  DECREMENT: (state, action) => ({
    counter: state.counter - action.payload
  })
}, { counter: 0 });

export default handleActions({
    [actions.requestList]: state => ({
        ...state,
        fetch: true,
    }),
    [actions.receiveList]: {
        // 正常時
        next: (state, { payload }) => ({
            ...state,
            list: payload,
            errorMessage: null,
            fetch: false,
        }),
        // 例外時
        throw: (state, { payload }) => ({
            ...state,
            list: null,
            errorMessage: payload.message,
            fetch: false,
        }),
    },
}, { /* default state here */ });
```

## Edge.jsを使用したJavaScript-C#間でのオブジェクトのやり取り

画像処理を行う場合、JavaScript-C#間でデータのやり取りを行わないといけないが  
ちょっと癖がある様子。

JavaScriptでCanvasに直接描画できるImageDataオブジェクトがあります。その周辺のオブジェクトを引数戻り値として使用しできるか試してみたところ

JavaScript -> C#

|引数|結果|note|
|:--|:--|:--|
|ImageData|×||
|Uint8ClampedArray|×|ImageData内部の画像データ部

JavaScript -> C#

|引数|結果|note|
|:--|:--|:--|
|char[]|x| |
|byte[]|Uint8Array|.|

## JavaScriptでのロジック

JavaScriptでは型固定でないので、bitshift演算部で想定外の演算が起こることがあります（というかおこった）

回避のため、デコードのロジック部でIntへ変換を試みていますが、
- Immutable内で保証
- Flow導入

等を検討する必要があります。検討します
