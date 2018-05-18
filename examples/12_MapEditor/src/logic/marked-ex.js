import actions from '../actions';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import Immutable from 'immutable';
//import crypto from 'crypto'; //ハッシュ化

//import wavedrom from 'wavedrom';
import mermaid from 'mermaid';
import sql from 'sql.js';
import fs from 'fs';
import marked from 'marked';
import wfmap from './wfmap.js';

mermaid.mermaidAPI.initialize({
  startOnLoad: false,
  gantt: {
    axisFormat: '%m-%d'
  }
});

export function markdownCreate(code){
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
    let dst;
    try {
      switch(lang){
        case 'mermaid':
            mermaid.mermaidAPI.render(
              `mermaid-${Date.now()}`,
              code,
              (svgCode)=>( dst = svgCode )
            )
          return dst;
        case 'wfmap':
          return wfmap.render(code);
        default:
          break;
      }
    } catch(error) {
      dst = code;
    }
  };

  return marked(code, {
        renderer: renderer,
        highlight: highlight,
        gfm: true,
        tables: true,
        breaks: true,
        sanitize: false
    })
}

export function mermaidCreate(path){

  let filebuffer = fs.readFileSync(path);
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

  let svg;
  try {
    mermaid.mermaidAPI.render(
      `mermaid-${Date.now()}`,
      dst,
      (svgCode)=>( svg = svgCode )
    )
  } catch(error) {
    svg = "<p>err</p>";
  }
  return svg;
}

// var time = new Date().getTime();
// while (new Date().getTime() < time + 10000);

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
