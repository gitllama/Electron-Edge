import { call, put, take, takeEvery, takeLatest } from 'redux-saga/effects'
import edge from 'electron-edge-js';
import { requestEdge, receiveEdge, EDGE_ASYNC } from '../actions';

function runEdge(code, params){
  return new Promise((resolve, reject) => {
    try{
      const hoge = edge.func(code);
      hoge(params, (error, result)=>{
        //if (error) throw error;
        if(error) reject(error);
        resolve(result);
      });
    }catch(e){
      //throw e
      resolve(e);
    }
  });
}

export function* fetchEdge(action) {
  yield put(requestEdge("start"));
  var result = yield call(runEdge, action.value, null);
  yield put(receiveEdge(result));
}

// 見通しが悪いのでrootSagaはreducerに
/*
export function* rootSaga() {
  yield takeEvery('EDGE_ASYNC', fetchEdge);
  //yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
  //yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
}
*/



/*
USER_FETCH_REQUESTED Action が送出されるたびに fetchUser を起動します。
ユーザ情報の並列取得にも対応しています。
代わりに takeLatest を使うこともできます。
しかし、ユーザ情報の並列取得には対応しません。
もしレスポンス待ちの状態で USER_FETCH_REQUESTED を受け取った場合、
待ち状態のリクエストはキャンセルされて最後の1つだけが実行されます。
*/
