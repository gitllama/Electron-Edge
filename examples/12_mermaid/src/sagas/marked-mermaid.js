import actions from '../actions';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import Immutable from 'immutable';
//import crypto from 'crypto'; //ハッシュ化
import mermaid from 'mermaid';
import sql from 'sql.js';
import fs from 'fs';
import marked from 'marked';

//mermaid初期化と描画呼び出し

mermaid.mermaidAPI.initialize({
  startOnLoad: false,
  gantt: {
    axisFormat: '%m-%d'
  }
});

let mermaididcount = 0;
function markdownCreate(code){
  if(mermaididcount > 100) mermaididcount = 0; //idが同じだと表示バグり気味
  let renderer = new marked.Renderer();
  // renderer.heading = function (text, level) {
  //   var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  //
  //   return '<h' + level + '><a name="' +
  //                 escapedText +
  //                  '" class="anchor" href="#' +
  //                  escapedText +
  //                  '"><span class="header-link"></span></a>' +
  //                   text + '</h' + level + '>';
  // },
  let highlight = function(code, lang, callback){
    if(lang == 'mermaid'){
      let dst;
      try {
        mermaid.mermaidAPI.render(
          `idmermaid${mermaididcount++}`,
          code,
          (svgCode)=>( dst = svgCode )
        )
      } catch(error) {
        dst = code;
      }
      return dst;
    }
  }
  return marked(code, {
        renderer: renderer,
        highlight: highlight,
        gfm: true,
        tables: true,
        breaks: true,
        sanitize: false
    })
}

export function* markdownAsync(action) {
  let contents = fs.readFileSync("welcome.md")

  let dst = markdownCreate(contents.toString());

  //let state = yield select();
  //let code = state.get("mermaid")
  //let code = yield select(state => state.get("mermaid"))

  // yield call(
  //   (e) => {
  //     try {
  //       mermaid.mermaidAPI.render(
  //         "id" + count++,
  //         e,
  //         (svgCode)=>( dst = svgCode )
  //       )
  //     } catch(error) {
  //       dst = "<p>w</p>";
  //     }
  //   }, code
  // );

  //装飾追加
  // dst = dst.replace(
  //   'class="sectionTitle sectionTitle0"',
  //   'class="sectionTitle sectionTitle0" stroke="red"');

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('svg', dst))
  ));
}

export function* sqlAsync(action) {
  console.log(action);
  let svg;
  if(count > 100) count = 0; //idが同じだと表示バグり気味

  let contents = yield call(
    filename => new Promise(
      (resolve, reject) => {
        let filebuffer = fs.readFileSync(filename);
        let db = new sql.Database(filebuffer);
        //let contents = db.exec("SELECT ID FROM test");
        let dst = "gantt\n";
        dst += "  dateFormat YYYY-MM-DD\n";
        dst += "  title GANTT diagram\n";
        dst += "  section Lot001\n";
        db.each('SELECT id, start_date, end_date FROM test', null, row => {
          dst += `    ${row.id} : ${row.id}, ${row.start_date}, ${row.end_date}\n`
        });
        db.close();
        resolve(dst);
      }
    ), 'DB.db'
  );
  console.log(contents);

  //mermaid初期化と描画呼び出し
  mermaid.mermaidAPI.initialize({
    startOnLoad: false,
    gantt: {
      axisFormat: '%m-%d'
    }
  });
  yield call(
    (e) => {
      try {
        mermaid.mermaidAPI.render(
          "id" + count++,
          e,
          (svgCode)=>( svg = svgCode )
        )
      } catch(error) {
        dst = "<p>w</p>";
      }
    }, contents
  );

  //書き出し
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('svg', svg))
  ));
}




// var time = new Date().getTime();
// while (new Date().getTime() < time + 10000);
