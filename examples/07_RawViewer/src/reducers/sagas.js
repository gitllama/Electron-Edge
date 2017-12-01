import { call, put, take, takeEvery, takeLatest } from 'redux-saga/effects'
import edge from 'electron-edge-js';
import actions from '../actions/action';

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

export function* fetchDecord(action) {
  console.log('fetchDecord :', action);
  let result = yield call(decord, action.payload);
  yield put(actions.receiveDecord(result));
}

export function* fetchReadFile(action) {
  console.log(action);
  let result = yield call(readfile, action.payload);
  yield put(actions.receiveRaw(result));
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
