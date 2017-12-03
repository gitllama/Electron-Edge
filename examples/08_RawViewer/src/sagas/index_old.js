import { call, put, take, select, takeEvery, takeLatest } from 'redux-saga/effects'
import edge from 'electron-edge-js';
import actions from '../actions';

//saga monitor

export default function* rootSaga() {
  yield all([
    setTake('REQUEST_DECORD_ASYNC', fetchDecord),
    setTake('READ_FILE_ASYNC', fetchReadFile),
    setTake('READ_FILE', (state, action)=>(
      state.withMutations(m => (
        m.set('file', action.payload)
         .set('flagReadFile', true)
      ))
    ),
  ])
}
function* setTake(actionName, func) {
  if(actionName.endsWith("_ASYNC")){
    yield takeEvery(actionName, fetchDecord);
  }else{
    yield takeEvery(actionName, function* (action)=>{
      yield put(actions.reducerChange(
        (state)=>func(state, action)
      ));
    });
  }
}

function* fetchReadFile() {
  while (yield select(state => state.get('flagReadFile'))) {
    let params = yield select(state => {file : state.file, type : state.type});
    let dst = yield call(readfile, params);
    yield put(actions.receiveRaw(dst));
  }
}
function* fetchDecord() {
  while (yield select(state => state.get('flagDecord'))) {
    let params = yield select(state => {
      type : action.payload.get('type'),
      rawdata : state.get('rawdata'),
      width : state.get('width'),
      height : state.get('height'),
      bitshift : state.get('bitshift'),
      offset : state.get('offset')
    });
    let result = yield call(decord, params);
    yield put(actions.reducerReceiveDecord(result));
  }
}

//Logic
const conv = {
  ["Int32"] : (e) => new Int32Array(e),
  ["Float32"] : (e) => new Float32Array(e),
}

function readfile(params){
  switch(params.type){
    default:
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(evt){
          let dst = conv[params.type](evt.target.result);
          //let dst = dst.map((x)=> Math.floor(x));
          resolve({rawdata: dst , filename : params.file.name});
        }
        reader.readAsArrayBuffer(params.file);
      });
      break;
  }
}

function decord(params){
  switch(params.type){
    case 'DLL':
      return decordEdge(params);
      break;
    default:
      return decordJS(params);
      break;
  }
}

function decordJS(params){
  return new Promise((resolve, reject) => {
    let{ rawdata, width, height } = params;
    let imagedata = new ImageData(width, height);

    //int保証しないと変な動きする
    //(params.offset >> 0)でもよいがInt.Maxの時は符号反転したりするので
    let offset = params.offset;
    let bitshift = Math.floor(params.bitshift);

    const to8bit = (n) => n > 255 ? 255 : n < 0 ? 0 : n;
    let buf = 0;
    let count = 0;
    let count2 = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        buf = to8bit((Math.floor(rawdata[count2] + offset)) >> bitshift);
        imagedata.data[count++] = buf;
        imagedata.data[count++] = buf;
        imagedata.data[count++] = buf;
        imagedata.data[count++] = 0xFF;
        count2++;
      }
    }
    resolve(imagedata);
  });
}

function decordEdge(params){
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
            string filepath = ((dynamic)input).file.path;
            int count = 0;
            using (BinaryReader w = new BinaryReader(File.OpenRead(filepath)))
            {
                for (int i = 0; i < 2256*1178; i++)
                {
                   int hoge = w.ReadInt32();
                   byte hoge2 = hoge > 255 ? (byte)255 : hoge < 0 ? (byte)0 : (byte)hoge;
                   dst[count++] = hoge2;
                   dst[count++] = hoge2;
                   dst[count++] = hoge2;
                   dst[count++] = 0xFF;
                }
            }
            //Console.WriteLine( ((dynamic)input).file.path );
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
}

import { call, put, take, select, takeEvery, takeLatest } from 'redux-saga/effects'
import edge from 'electron-edge-js';
import actions from '../actions';

//saga monitor

export default function* rootSaga() {
  yield all([
    fetchReadFile,
    fetchDecord,
  ])
}

// function* rootSagaA() {
//   yield takeEvery('REQUEST_DECORD_ASYNC', fetchDecord);
//   yield takeEvery('READ_FILE_ASYNC', fetchReadFile);
// }

function* fetchReadFile() {
  while (yield select(state => state.get('flagReadFile'))) {
    let params = yield select(state => {file : state.file, type : state.type});
    let dst = yield call(readfile, params);
    yield put(actions.receiveRaw(dst));
  }
}
function* fetchDecord() {
  while (yield select(state => state.get('flagDecord'))) {
    let params = yield select(state => {
      type : action.payload.get('type'),
      rawdata : state.get('rawdata'),
      width : state.get('width'),
      height : state.get('height'),
      bitshift : state.get('bitshift'),
      offset : state.get('offset')
    });
    let result = yield call(decord, params);
    yield put(actions.reducerReceiveDecord(result));
  }
}

//Logic
const conv = {
  ["Int32"] : (e) => new Int32Array(e),
  ["Float32"] : (e) => new Float32Array(e),
}

function readfile(params){
  switch(params.type){
    default:
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(evt){
          let dst = conv[params.type](evt.target.result);
          //let dst = dst.map((x)=> Math.floor(x));
          resolve({rawdata: dst , filename : params.file.name});
        }
        reader.readAsArrayBuffer(params.file);
      });
      break;
  }
}

function decord(params){
  switch(params.type){
    case 'DLL':
      return decordEdge(params);
      break;
    default:
      return decordJS(params);
      break;
  }
}

function decordJS(params){
  return new Promise((resolve, reject) => {
    let{ rawdata, width, height } = params;
    let imagedata = new ImageData(width, height);

    //int保証しないと変な動きする
    //(params.offset >> 0)でもよいがInt.Maxの時は符号反転したりするので
    let offset = params.offset;
    let bitshift = Math.floor(params.bitshift);

    const to8bit = (n) => n > 255 ? 255 : n < 0 ? 0 : n;
    let buf = 0;
    let count = 0;
    let count2 = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        buf = to8bit((Math.floor(rawdata[count2] + offset)) >> bitshift);
        imagedata.data[count++] = buf;
        imagedata.data[count++] = buf;
        imagedata.data[count++] = buf;
        imagedata.data[count++] = 0xFF;
        count2++;
      }
    }
    resolve(imagedata);
  });
}

function decordEdge(params){
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
            string filepath = ((dynamic)input).file.path;
            int count = 0;
            using (BinaryReader w = new BinaryReader(File.OpenRead(filepath)))
            {
                for (int i = 0; i < 2256*1178; i++)
                {
                   int hoge = w.ReadInt32();
                   byte hoge2 = hoge > 255 ? (byte)255 : hoge < 0 ? (byte)0 : (byte)hoge;
                   dst[count++] = hoge2;
                   dst[count++] = hoge2;
                   dst[count++] = hoge2;
                   dst[count++] = 0xFF;
                }
            }
            //Console.WriteLine( ((dynamic)input).file.path );
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
}
/*****/

function _decordEdge(params){
  return new Promise((resolve, reject) => {
    console.log("decord Edge");
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
            string filepath = ((dynamic)input).file.path;
            int count = 0;
            using (BinaryReader w = new BinaryReader(File.OpenRead(filepath)))
            {
                for (int i = 0; i < 2256*1178; i++)
                {
                   int hoge = w.ReadInt32();
                   byte hoge2 = hoge > 255 ? (byte)255 : hoge < 0 ? (byte)0 : (byte)hoge;
                   dst[count++] = hoge2;
                   dst[count++] = hoge2;
                   dst[count++] = hoge2;
                   dst[count++] = 0xFF;
                }
            }
            //Console.WriteLine( ((dynamic)input).file.path );
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
}

function _decordJS(params){
  return new Promise((resolve, reject) => {
    console.log("decord JS")
    let reader = new FileReader();
    reader.onload = function(evt){
      let imagedata = new ImageData(params.width, params.height);
      //let buf = new Int32Array(evt.target.result);
      let src = conv[params.type](evt.target.result);
      let bufindex = 0;

      //demosaic
      const to8bit = (n) => n > 255 ? 255 : n < 0 ? 0 : n;
      let buf = 0;
      let count = 0;
      let count2 = 0;
      for (let y = 0; y < params.height; y++) {
        for (let x = 0; x < params.width; x++) {
          buf = Math.floor(src[count2] - params.offset) >> params.bitshift
          buf = to8bit(buf);
          imagedata.data[count++] = buf;
          imagedata.data[count++] = buf;
          imagedata.data[count++] = buf;
          imagedata.data[count++] = 0xFF;
          count2++;
        }
      }
      resolve(imagedata);
    }
    reader.readAsArrayBuffer(params.file);
  });
}

/***/

export function* rootSaga() {
  yield takeEvery('REQUEST_DECORD_ASYNC', fetchDecord);
  yield takeEvery('READ_FILE_ASYNC', fetchReadFile);
}

const conv = {
  ["Int32"] : (e) => new Int32Array(e),
  ["Float32"] : (e) => new Float32Array(e),
}

function readJS(params){
  return new Promise((resolve, reject) => {
    console.log("read JS")
    let reader = new FileReader();
    reader.onload = function(evt){
      let src = conv[params.type](evt.target.result);
      let dst = src.map((x)=> Math.floor(x));
      resolve({rawdata: dst , filename : params.file.name});
    }
    reader.readAsArrayBuffer(params.file);
  });
}
function decordJS(params){
  return new Promise((resolve, reject) => {
    console.log("decord JS")
    let{ rawdata } = params;

    let imagedata = new ImageData(params.width, params.height);

    //int保証しないと変な動きする
    let offset = (params.offset >> 0)//Math.floor(params.offset);
    let bitshift = (params.bitshift >> 0)//Math.floor(params.bitshift);

    const to8bit = (n) => n > 255 ? 255 : n < 0 ? 0 : n;
    let buf = 0;
    let count = 0;
    let count2 = 0;

    for (let y = 0; y < params.height; y++) {
      for (let x = 0; x < params.width; x++) {
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
}

function decordEdge(params){
  return new Promise((resolve, reject) => {
    console.log("decord Edge");
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
            string filepath = ((dynamic)input).file.path;
            int count = 0;
            using (BinaryReader w = new BinaryReader(File.OpenRead(filepath)))
            {
                for (int i = 0; i < 2256*1178; i++)
                {
                   int hoge = w.ReadInt32();
                   byte hoge2 = hoge > 255 ? (byte)255 : hoge < 0 ? (byte)0 : (byte)hoge;
                   dst[count++] = hoge2;
                   dst[count++] = hoge2;
                   dst[count++] = hoge2;
                   dst[count++] = 0xFF;
                }
            }
            //Console.WriteLine( ((dynamic)input).file.path );
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
}

function decord(params){
  switch(params.type){
    case 'DLL':
      return decordEdge(params);
      break;
    default:
      return decordJS(params);
      break;
  }
}

function readfile(params){
  switch(params.type){
    default:
      return readJS(params);
      break;
  }
}

export function* fetchReadFile(action) {
  console.log('fetchReadFile :',action);
  let result = yield call(readfile, action.payload);
  yield put(actions.receiveRaw(result));
}

export function* fetchDecord(action) {
  console.log('fetchDecord :', action);
  let result = yield call(decord, {
    rawdata : action.payload.get('rawdata'),
    width : action.payload.get('width'),
    height : action.payload.get('height'),
    bitshift : action.payload.get('bitshift'),
    offset : action.payload.get('offset')
  });
  yield put(actions.receiveDecord(result));
}
