import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';
import { ipcRenderer } from 'electron'

import fs from 'fs';
import deepAssign from 'deep-assign';
import Client from 'ssh2-sftp-client';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function connect(addr) {
  return new Promise((resolve, reject) => {
    let sftp = new Client();
    sftp.connect(addr).then(() => {
      return sftp.list('/');
    }).then((data) => {
      console.log('the data info');
      resolve(data);
      // data.forEach((i)=>{
      //   if(i.type == 'd') console.log(i.name)
      // })
    }).catch((err) => {
      console.log(err, 'catch error');
      reject(err);
    });
  });
}

function checkObject(obj, arr){
  if(obj == null) return null;
  let dst = null;
  if(arr.length > 1){
    if(obj[arr[0]]){
      let hoge = arr.slice()
      hoge.shift()
      return checkObject(obj[arr[0]],hoge)
    }else{
      return null;
    }
  }
  return obj[arr[0]];
}

export function* init(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('config', action.payload)
    )
  ));

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
    )
  ));
}

export function* connectAsync(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));
  let addr = yield select(state => state.get("config"));
  let json = yield connect(addr["ftp"]);

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('json', json)
      .set('busy', false)
    )
  ));
}
