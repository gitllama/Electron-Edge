import { call, put, take, select, takeEvery, takeLatest } from 'redux-saga/effects'
import edge from 'electron-edge-js';
import actions from '../actions';

//saga monitor

export default function* rootSaga() {
  for(let key in takeSagas){
    yield fork(setTake, key, takeSagas[key]);
  }
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

//saga

//stateの監視しても良いが、フローがわかりにくくなりそう
const takeSagas = {
  ['READ_FILE_ASYNC'] : funciton* (action)=>{
    let dst = yield call(readfile, action.payload);
    yield put(actions.reducerChange(state=>(
      state.withMutations(m => (
        m.set('rawdata', dst)
      ))
    )));
    let params = yield select(state => state)
    let dst = yield call(decord, params);
    yield put(actions.reducerChange(state=>(
      state.withMutations(m => (
        m.set('imagedata', dst)
      ))
    )));
  },
  ['REFLASH_ASYNC'] : funciton* (action)=>{
    let params = yield select(state => state)
    let dst = yield call(decord, params);
    yield put(actions.reducerChange(state=>(
      state.withMutations(m => (
        m.set('imagedata', dst)
      ))
    )));
  ),
  ['CHANGE_PARAMS_ASYNC'] : funciton* (action)=>{
    // let params = yield select(state => {
    //   type : state.get('type'),
    //   rawdata : state.get('rawdata'),
    //   width : state.get('width'),
    //   height : state.get('height'),
    //   bitshift : state.get('bitshift'),
    //   offset : state.get('offset')
    // });
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
  },

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


//Logic
const conv = {
  ["Int32"] : (e) => new Int32Array(e),
  ["Float32"] : (e) => new Float32Array(e),
}

function readfile(action){
  switch(action.payload.type){
    default:
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(evt){
          let dst = conv[action.payload.type](evt.target.result);
          //let dst = dst.map((x)=> Math.floor(x));
          resolve({rawdata: dst , filename : action.payload.file.name});
        }
        reader.readAsArrayBuffer(action.payload.file);
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
      break;
    default:
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
      break;
  }
}
