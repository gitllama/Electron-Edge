import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';

import fs from 'fs';
import * as markedex from '../logic/marked-ex.js';
import * as logmatch from '../logic/logmatch.js';
import wfmap from '../logic/wfmap.js'

const WfNo = 1;
const wfno_dummy = 1;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// !! SubComponents内で呼ぶ関数はDidMountにbusy入れると
// 無限ループしがちだよ

export function* exportSVGAsync(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));

  let mapdata = yield select(state => state.get("wfmap"))
  let mapconfig = yield select(state => state.get("mapconfig"))
  let wfselect = yield select(state => state.get("wfselect"))

  let dst;
  dst = wfmap.renderLegend(mapconfig, null)
  fs.writeFileSync("legend.svg", dst)
  wfselect.forEach((i)=>{
    let wfstate = mapdata[i];
    if(wfstate){
      let hoge = Object.keys(wfstate).map((i)=> {return {
        "x" : wfstate[i]["x"],
        "y" : wfstate[i]["y"],
        "text" : wfstate[i]["bin"]
      }});
      dst = wfmap.render(Object.assign({ "chip" :hoge }, mapconfig), null)
      fs.writeFileSync(`${i}.svg`, dst)
    }
  })
  console.log('save successful!');

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', false))
  ));
}

export function* markdownAsync(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));

  let contents = fs.readFileSync(action.payload)
  let dst = markedex.markdownCreate(contents.toString());

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('html', dst).set('busy', false))
  ));
}

export function* sqlAsync(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));

  let svg = markedex.mermaidCreate(action.payload)

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('html', svg).set('busy', false))
  ));
}

export function* readlogAsync(action) {
  let config = yield select(state => state.get("config"))
  let mapconfig = yield select(state => state.get("mapconfig")["effective"])
  let wt2chip = {}

  let path = `${config["data"]["path"]}/Datalog_${("00" + wfno_dummy).slice( -2 )}.txt`;

  Object.keys(mapconfig).forEach((n)=> (
    wt2chip[`${mapconfig[n]["wt"]}`] = {
      "n" : `${n}`,
      "x" : mapconfig[n]["x"],
      "y" : mapconfig[n]["y"]
  }));

  let dst = {};
  let wfselect = yield select(state => state.get("wfselect"))
  wfselect.forEach((n) => logmatch.getBin(path, n, wt2chip, dst))
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('wfmap', dst))
  ));
}

export function* readtestAsync(action) {

  let config = yield select(state => state.get("config"))
  const path =(n)=>(`${config["data"]["path"]}/Datalog_${("00" + n).slice( -2 )}.txt`);

  let wfmap = yield select(state => state.get("wfmap"))

  Object.keys(wfmap).forEach((wfno)=>{
    let filepath = path(wfno_dummy);
    let txt = fs.readFileSync(filepath).toString();
    let arr = txt.split(/\r\n|\r|\n/);

    // map[chipno.toString()] = {};
    Object.keys(wfmap[wfno]).forEach((chipno)=>{
      let start = wfmap[wfno][chipno]["start"]
      let end = wfmap[wfno][chipno]["end"]
      //let wtco = wfmap[wfno][chipno]["wt"]
      let dst = logmatch.getMeasured(arr, start, end, "OS_Pch", "VDDCELL")
      wfmap[wfno][chipno]["result"] = logmatch.unitParseFloat(dst);
    })
  });

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('wfmap', wfmap))
  ));

  // wt2chip[`${mapconfig[n]["wt"]}`] = `${n}`)
  //
  // wfselect.forEach((w)=>{
  //   map[w.toString()] = {};
  //   Object.keys(mapconfig).forEach((chip)=>{
  //     let wtco = mapconfig[chip]["wt"]
  //     let dst = getMeasured(
  //       arr,
  //       dic[wfno][wtco]["start"],
  //       dic[wfno][wtco]["end"],
  //       "OS_Pch", "VDDCELL"
  //     );
  //
  //     map[w.toString()][chip.toString()] = unitParseFloat(dst);
  //
  //   })
  // });
}



// var f1 = fetch("/").then(e => e.text())
// var f2 = fetch("/test.jpg").then(e => e.blob())
// var text = yield f1
// console.log(text.substr(0,14))
// var blob = yield f2
