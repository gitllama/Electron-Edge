import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import Immutable from 'immutable';
import {getPngChunkData, getPngChunkString} from './PreviewableRaw';
import fs from 'fs';
import cv from 'opencv.js';

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

  ['CHANGE_PARAMS'] : (state, action) => (
    state.withMutations(m => {
      m.set('bitshift', action.payload.bitshift)
       .set('offset', action.payload.offset)
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
  ['WRITE_MESSAGE'] : (state, action) => (
    state.withMutations(m => (
      m.set('message', action.payload)
    ))
  ),
  ['EXPORT_CSV'] : (state, action) => {
    writeCSV(action.payload, state.get('rawdata'), state.get('width'), state.get('height'))
    return state;
  },
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
  // let dst = yield call(decord, params);
        let dst = yield call(decord2, params);


  yield put(actions.reducerChange(state=>(
    state.withMutations(m => (
      m.set('imagedata', dst)
    ))
  )));
}

//Logic
const conv = {
  ["Int8"] : (e) => new Int8Array(e),
  ["UInt8"] : (e) => new UInt8Array(e),
  ["Int16"] : (e) => new Int16Array(e),
  ["Uint16"] : (e) => new Uint16Array (e),
  ["Int32"] : (e) => new Int32Array(e),
  ["Uint32"] : (e) => new Uint32Array (e),
  ["Float32"] : (e) => new Float32Array(e),
  ["Float64"] : (e) => new Float64Array(e),
}

function readfile(params){
  switch(params.type){
    case 'RAWPNG':
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(evt){
          let json = JSON.parse(getPngChunkString(evt.target.result, "raWh"))
          let dst = getPngChunkData(evt.target.result, "raWd");
          dst = conv[json.type](dst);
          dst = dst.map((x)=> Math.floor(x));
          resolve(dst);
        }
        reader.readAsArrayBuffer(params.file);
      });
    break;
    default:
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(evt){
          let dst = conv[params.type](evt.target.result);
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
    default:
      return new Promise((resolve, reject) => {
        let{ rawdata, width, height } = params;
        let imagedata = new ImageData(width, height);

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

function decord2(params){
  switch(params.type){
    default:
      return new Promise((resolve, reject) => {
        let{ rawdata, width, height } = params;

        let dst = new cv.Mat(1178, 2256, cv.CV_8UC1);

        let offset = Math.floor(params.offset);
        let bitshift = Math.floor(params.bitshift);

        const to8bit = (n) => n > 255 ? 255 : n < 0 ? 0 : n;
        let buf = 0;
        let count = 0;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            buf = to8bit((rawdata[count] + offset) >> bitshift);
            dst.data[count] = buf;
            count = count + 1;
          }
        }

        let dst2 = new cv.Mat();
        let dst3 = new cv.Mat();
        cv.cvtColor(dst, dst2, cv.COLOR_BayerBG2BGR);
        cv.cvtColor(dst2, dst2, cv.COLOR_BGR2BGRA);


        let imgData = new ImageData(new Uint8ClampedArray(dst2.data), 2256, 1178);

        dst.delete();
        dst2.delete();
        dst3.delete();
        resolve(imgData);
      });
      break;
  }
}

function writeCSV(path, content, w, h){
  let formatCSV = "";
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      formatCSV += `${content[x + y * w]}, `;
    }
    formatCSV += '\n';
  }
  fs.writeFile(path, formatCSV, 'utf8', function (err) {
    if (err) {
      console.log('export err');
    } else {
      console.log('export success');
    }
  });
}
