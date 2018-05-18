import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';

import fs from 'fs';
import * as markedex from '../logic/marked-ex.js';
import * as logmatch from '../logic/logmatch.js';
import wfmap from '../logic/wfmap.js'


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// !! SubComponents内で呼ぶ関数はDidMountにbusy入れると
// 無限ループしがちだよ

export function* init(action) {
  //mapconfigの作成
  const defaultmap = action.payload["defaultmap"]

  let dst = {"wt2chip" :{} }
  Object.keys(defaultmap["effective"]).forEach((n)=> (
    dst["wt2chip"][`${defaultmap["effective"][n]["wt"]}`] = {
      "n" : `${n}`,
      "x" : defaultmap["effective"][n]["x"],
      "y" : defaultmap["effective"][n]["y"]
  }));
  const mapconfig = Object.assign(dst, defaultmap)

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
      .set('config', action.payload)
      .set('mapconfig',mapconfig)
    )
  ));
}

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

  let path = action.payload
  //let path = yield select(state => state.get("config")["data"]["path"])
  let wt2chip = yield select(state => state.get("mapconfig")["wt2chip"])

  let wfselect = [...new Array(54)].map((_,i)=>i+1)
  //let wfselect = yield select(state => state.get("wfselect"))

  let dst = {};
  wfselect.forEach((wfno) =>{
    logmatch.getBin(
      `${path}/Datalog_${("00" + wfno).slice( -2 )}.txt`,
      wfno,
      wt2chip,
      dst
    )
  });

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('wfresult', dst))
  ));

  //最後にbinでのwfmapの生成
  yield readtestAsync({payload : "bin"})

}

export function* readtestAsync(action) {
  let config = yield select(state => state.get("mapconfig")["config"])
  let legend = yield select(state => state.get("mapconfig")["legend"])
  let wfresult = yield select(state => state.get("wfresult"))

  let dst = {};
  Object.keys(wfresult).forEach((wf)=>{
    dst[wf] = {};
    dst[wf]["title"] = `Wf${wf}`;
    dst[wf]["config"] = config;
    dst[wf]["legend"] = legend;
    dst[wf]["chip"] = {}
    let hoge = dst[wf]["chip"]
    Object.keys(wfresult[wf]).forEach((chip)=>{
      hoge[chip] = {};
      hoge[chip]["x"] = wfresult[wf][chip]["x"];
      hoge[chip]["y"] = wfresult[wf][chip]["y"];
      hoge[chip]["value"] = wfresult[wf][chip][action.payload];
      hoge[chip]["background"] = wfresult[wf][chip]["background"] || "auto";
    })
  })

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('wfmap', dst))
  ));
}



// var f1 = fetch("/").then(e => e.text())
// var f2 = fetch("/test.jpg").then(e => e.blob())
// var text = yield f1
// console.log(text.substr(0,14))
// var blob = yield f2
