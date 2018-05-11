import actions from '../actions';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import Immutable from 'immutable';
import sql from 'sql.js';
import fs from 'fs';

const rDevice = /Device#:(\s\d+)$/;
const rEnd = /^=========================================================================$/;

//正規表現テスト
// chip毎一括でまず分離

export function* readlogAsync(action) {

  //console.log("readlogAsync")

  let dst = "";
  let txt = fs.readFileSync('Datalog.txt').toString();
  let arr = txt.split(/\r\n|\r|\n/);
  let dic = {};
  let chipno = -1;

  arr.forEach((v , i, a)=>{
    switch(chipno){
      case -1:
        let result = v.match(rDevice);
        if(result != null) {
          chipno = result[1];
          dic[chipno] = {}
          dic[chipno]["start"] = i
        }
        break;
      default:
        if(v.match(rEnd) != null) {
          dic[chipno]["end"] = i
          dic[chipno]["bin"] = a[i-1].split(/\s+/)[3]; //get bin no (1site only)
          chipno = -1;
        }
        break;
    }
  });
  console.log(dic);
  //
  // //書き出し
  // yield put(actions.reducerChange(
  //   (state)=> state.withMutations(m => m.set('svg', dst))
  // ));
}






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
