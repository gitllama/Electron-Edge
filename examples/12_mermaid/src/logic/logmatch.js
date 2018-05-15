import actions from '../actions';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import Immutable from 'immutable';
import sql from 'sql.js';
import fs from 'fs';


//正規表現テスト
// chip毎一括でまず分離

const WfNo = 1;

const wfno_dummy = 1;


//------------------------------


function unitParseFloat(val){
  const Units = {
    "p" : "E-12",
    "n" : "E-9",
    "u" : "E-6",
    "m" : "E-3",
    "K" : "E+3",
    "V" : "",
    "A" : ""
  }
  if(val == null) return null;
  let hoge = val;
  Object.keys(Units).forEach((n)=>{
    hoge = hoge.replace(n, Units[n]);
  })
  hoge =  hoge.replace(" ", "");
  return parseFloat(hoge);
}

function getBin(path, wfno, wt2chip, dst){
  const rDevice = /Device#:(\s\d+)$/;
  const rEnd = /^=========================================================================$/;

  let txt = fs.readFileSync(path).toString();
  let arr = txt.split(/\r\n|\r|\n/);

  let chipno = null;
  let wfnostr = `${wfno}`;
  dst[wfnostr] = {};

  arr.forEach((v, i, a)=>{
    if(chipno == null){
      //startの検索
      let result = v.match(rDevice);
      if(result != null) {
        //一致するchipnoの取得
        let devno = `${result[1]}`.trim();
        chipno = wt2chip[devno]["n"]
        dst[wfnostr][chipno] = {}
        dst[wfnostr][chipno]["start"] = i
        dst[wfnostr][chipno]["x"] = wt2chip[devno]["x"]
        dst[wfnostr][chipno]["y"] = wt2chip[devno]["y"]
        dst[wfnostr][chipno]["wt"] = devno
      }
    }else{
      if(v.match(rEnd) != null) {
        dst[wfnostr][chipno]["end"] = i
        dst[wfnostr][chipno]["bin"] = a[i-1].split(/\s+/)[3]; //get bin no (1site only)
        chipno = null;
      }
    }
  });
}

function getMeasured(arr, start, end, testname, pinname){
  const reg = /^(.{12})(.{6})(.{9})(.{26})(.{15})(.{10})(.{15})(.{15})(.{15})(.{15})/;
  const rNumber = 1;
  const rSite = 2;
  const rResult = 3;
  const rTestName = 4;
  const rPin = 5;
  const rChannel = 6;
  const rLow = 7;
  const rMeasured = 8;
  const rHigh = 9;
  const rForce = 10;

  for(let i = start;  i < end;  i++  ) {
    let dst = arr[i].match(reg);
    if(dst == null) continue;
    if(dst[rTestName].trim() != testname || dst[rPin].trim() != pinname) continue;
    return dst[rMeasured];
  }
  return null;
}


//------------------------------


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
  wfselect.forEach((n) => getBin(path, n, wt2chip, dst))
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
      let dst = getMeasured(arr, start, end, "OS_Pch", "VDDCELL")
      wfmap[wfno][chipno]["result"] = unitParseFloat(dst);
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


//------------------------------


// fs.readFile('Datalog.txt', 'utf8', (err, text) => {
//     let DeviceNos = [];
//     let arr = text.split(/\r\n|\r|\n/);
//     let chipno = -1;
//     arr.forEach((v , i)=>{
//       switch(chipno){
//         case -1:
//           let result = v.match(rDevice);
//           if(result != null) {
//             chipno = result[1];
//             dic[chipno] = {}
//             dic[chipno]["start"] = i
//           }
//           break;
//         default:
//           if(v.match(rEnd) != null) {
//             dic[chipno]["end"] = i
//             chipno = -1;
//           }
//           break;
//       }
//     });
//     console.log(dic)
// });
