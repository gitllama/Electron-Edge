# RawViewer

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
|配列|object[]||
|Int32Array|Dynamic.ExpandoObject||
|Uint8ClampedArray|Dynamic.ExpandoObject|ImageData内部の画像データ部
|ImageData|Dynamic.ExpandoObject||

JavaScript -> C#

|引数|結果|note|
|:--|:--|:--|
|char[]|配列['\u0000','\u0000']|ImageDataにはそのまま入らない|
|int[]|配列[0,0]|ImageDataにはそのまま入らない|
|byte[]|Buffer配列 <Buffer 00 00>|ImageDataに入る|
|Dictionary<>|連想配列{key:val}|.|

Uint8ClampedArrayはDynamic.ExpandoObjectでやり取りされるので以下のような形で書き換えを実行できる。ただ、参照を渡しているわけではないので元オブジェクトの値が変更されるわけではない

```javascript
let code = edge.func(`
  using System;
  using System.IO;
  using System.Threading.Tasks;
  using System.Collections.Generic;
  using System.Dynamic;
  public class Startup
  {
    public async Task<object> Invoke(object input)
    {
      var i = ((IDictionary<string, Object>)input);
      i["1"] = 20;
      return i;
    }
  }
`);
code(new Uint8ClampedArray(10), (error, result)=>{
    console.log(result);
});
```

また、C#からExpandoObjectで戻り値を作成することもできるので

```C#
Dictionary<string, object> dic = new Dictionary<string, object>();
dic.Add("Int32", new int[10]);
dic.Add("Byte", new byte[10]);
dic.Add("Float", new float[10]);
dic.Add("Char", new char[10]);
return dic;

dynamic data = new ExpandoObject();
data.key = "a";
data.InputFromNode = input;
return data;
```

参照渡しやメモリマップドファイルのような機能をnode.jsから使用するのは筋が悪いので、

javascirpt配列/連想配列 -> C#配列/連想配列 -> javascirpt配列 -> Uint8ClampedArray

の様な変換となるように留意する方がよさそう

## JavaScriptでのロジック

JavaScriptでは型固定でないので、bitshift演算部で想定外の演算が起こることがあります（というかおこった）

回避のため、デコードのロジック部でIntへ変換を試みていますが、
- Immutable内で保証
- Flow導入

等を検討する必要があります。検討します
