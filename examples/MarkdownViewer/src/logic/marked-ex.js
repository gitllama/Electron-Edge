import actions from '../actions';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import Immutable from 'immutable';
//import crypto from 'crypto'; //ハッシュ化

//import wavedrom from 'wavedrom';
import mermaid from 'mermaid';
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
/*
  renderer.heading =(text, level)=> {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return '<h' + level + '><a name="' +
                  escapedText +
                   '" class="anchor" href="#' +
                   escapedText +
                   '"><span class="header-link"></span></a>' +
                    text + '</h' + level + '>';
  }
*/

  let highlight =(code, lang, callback)=>{
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

  let mark = marked(code, {
        renderer: renderer,
        highlight: highlight,
        gfm: true,
        tables: true,
        breaks: true,
        sanitize: false
    })

  return mark.split("<hr>");
}
