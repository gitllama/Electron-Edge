import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';
import edge from 'electron-edge-js';

//saga monitor

export default function* rootSaga() {
  for(let key in takeSagas) yield fork(setTake, key, takeSagas[key]);
}

function* setTake(actionName, callback) {
  if(actionName.indexOf("_ASYNCLATEST") > 0){
    yield takeLatest(actionName, callback);
  }
  else if(actionName.indexOf("_ASYNC") > 0){
    yield takeEvery(actionName, callback);
  }
  else{
    yield takeEvery(
      actionName,
      function * (action){
        yield put(actions.reducerChange(
          state => callback(state, action)
        ))
      }
    );
  }
}


const takeSagas = {
  ['READ_FILE_ASYNC'] : readfileasync,
  ['REFLASH_ASYNC'] : reflashasync,
  ['CHANGE_PARAMS_ASYNC'] : changeparamsasync,

  ['CHANGE_PARAMS'] : (state, action) => (
    state.withMutations(m => {
      m.set('bitshift', action.payload.bitshift)
       .set('offset', action.payload.offset)
       .set('params', Immutable.Map(action.payload))
    })
  ),
  ['CHANGE_SIZE'] : (state, action) => (
    state.withMutations(m => (
      m.set('size', action.payload)
    ))
  ),
  ['CHANGE_TYPE'] : (state, action) => (
    state.withMutations(m => (
      m.set('type', action.payload)
    ))
  ),
};

function* readfileasync(action){
  let type = yield select(state => state.get("type"))
  let dst = yield call(readfile, { file : action.payload, type : type});
  yield put(actions.reducerChange(state=>
    state.withMutations(m => (
      m.set('rawdata', dst)
       .set('filename',action.payload.name)
    ))
  ));
  yield call(reflashasync, action);
}
function* reflashasync(action){
  let state = yield select(state => state)
  let params = {
    type : state.get('type'),
    rawdata : state.get('rawdata'),
    width : state.get('width'),
    height : state.get('height'),
    bitshift : state.get('bitshift'),
    offset : state.get('offset')
  }
  if(params.rawdata == null)
    params.rawdata = new Int32Array(params.width * params.height);
  let dst = yield call(decord, params);
  yield put(actions.reducerChange(state=>(
    state.withMutations(m => (
      m.set('imagedata', dst)
    ))
  )));
}

function* changeparamsasync(action){
  yield put(actions.reducerChange(state=>(
    state.withMutations(m => (
      m.set('bitshift', action.payload.bitshift)
      .set('offset', action.payload.offset)
      .set('params', Immutable.Map(action.payload))
    ))
  )));
  let dst = yield call(decord, action.payload);
  yield put(actions.reducerChange(state=>(
    state.withMutations(m => (
      m.set('imagedata', dst)
    ))
  )));
}



//Logic
const conv = {
  ["Int32"] : (e) => new Int32Array(e),
  ["Float32"] : (e) => new Float32Array(e),
}

function readfile(params){
  switch(params.type){
    case 'DLL':
      return new Promise((resolve, reject) => {
        try{
          let hoge = edge.func(`
            using System;
            using System.IO;
            using System.Threading.Tasks;
            public class Startup
            {
              public async Task<object> Invoke(object input)
              {
                int[] dst = new int[2256*1178];
                string filepath = (dynamic)input;
                Console.WriteLine(filepath);
                using (BinaryReader w = new BinaryReader(File.OpenRead(filepath)))
                {
                    for (int i = 0; i < 2256*1178; i++)
                      dst[i] = w.ReadInt32();
                }
                return dst;
              }
            }
          `);
          hoge(params.file.path, (error, result)=>{
              if (error) throw error;
              resolve(result);
          });
        }catch(e){
          throw e
        }
      });
      break;
    default:
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(evt){
          let dst = conv[params.type](evt.target.result);
          //intにしておいた方が、演算エラーでにくいし早い
          dst = dst.map((x)=> Math.floor(x));
          resolve(dst);
        }
        reader.readAsArrayBuffer(params.file);
      });
      break;
  }
}

function decord(params){
  switch(params.type){
    case 'DLL':
      return new Promise((resolve, reject) => {
        try{
          let hoge = edge.func(`
            using System;
            using System.IO;
            using System.Threading.Tasks;
            public class Startup
            {
              public async Task<object> Invoke(object input)
              {
                byte[] dst = new byte[2256*1178*4];
                var src = ((dynamic)input).rawdata;
                int count = 0;
                for (int i = 0; i < 2256*1178; i++)
                {
                    byte hoge = src[i] > 255 ? (byte)255 : src[i]  < 0 ? (byte)0 : (byte)src[i];
                    dst[count++] = hoge;
                    dst[count++] = hoge;
                    dst[count++] = hoge;
                    dst[count++] = 0xFF;
                }
                return dst;
              }
            }
          `);
          hoge(params, (error, result)=>{
              if (error) throw error;
              let hoge = Uint8ClampedArray.from(result);
              let dst = new ImageData(hoge, params.width, params.height);
              resolve(dst);
          });
        }catch(e){
          throw e
        }
      });
      break;
    default:
      return new Promise((resolve, reject) => {
        let{ rawdata, width, height } = params;
        let imagedata = new ImageData(width, height);

        //int保証しないと変な動きする
        //(params.offset >> 0)でもよいがInt.Maxの時は符号反転したりするので
        let offset = Math.floor(params.offset);
        let bitshift = Math.floor(params.bitshift);

        const to8bit = (n) => n > 255 ? 255 : n < 0 ? 0 : n;
        let buf = 0;
        let count = 0;
        let count2 = 0;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            buf = to8bit((rawdata[count2] + offset) >> bitshift);
            imagedata.data[count++] = buf;
            imagedata.data[count++] = buf;
            imagedata.data[count++] = buf;
            imagedata.data[count++] = 0xFF;
            count2++;
          }
        }
        resolve(imagedata);
      });
      break;
  }
}
