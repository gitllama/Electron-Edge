import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';

import fs from 'fs';
import * as markedex from '../logic/marked-ex.js';

const header_height = 20
const footer_height = 5

const sectioncss = {
  "width":"210mm",
  "height":"296mm", /* 1mm余裕をもたせる */
  "pageBreakAfter": "always"
}
const headercss = {
  "left":"0mm",
  "top" : "0mm",
  "width" : "210mm",
  "height": `${header_height}mm`
}
const bodycss = {
  "borderWidth":"1px",
  "borderStyle":"solid",
  "left":"0mm",
  "top" : `${296 - footer_height - footer_height}mm`,
  "width" : "210mm",
  "height": `${296 - header_height - footer_height}mm`
}
const footercss =  {
  "left":"0mm",
  "width" : "210mm",
  "top" : `${296 - footer_height}mm`,
  "height": `${footer_height}mm`
}
const mapline = {
  "width" : "100%",
  "display": "flex",
  "justifyContent": "space-between"
}

function GetDateNow(){
  const now = new Date();
  const y = now.getFullYear();
  const m = ("00" + (now.getMonth()+1)).slice(-2);
  const d = ("00" + now.getDate()).slice(-2);
  const w = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'][now.getDay()];

  return `${y}-${m}-${d}`;
}

const title = "工程指示書 ver 1.1"
const docNo = "100-100"

function header(i, maxpage){
  return (
    <div style={headercss}>
      <img style={{"position" : "absolute", "left":"0mm", "top":"0mm", "height":"10mm"}} src="img/logo.svg"/>
      <div style={{"position" : "absolute", "left":"0mm", "top":"11mm", "fontSize" : "0.8em"}}>{title}</div>
      <div style={{"position" : "absolute", "left":"150mm", "top":"0mm", "fontSize" : "0.8em"}}>
        <tt>{`PAGE            : ${i}/${maxpage}`}</tt><br/>
        <tt>{`Document Number : ${docNo}`}</tt><br/>
        <tt>{`Date            : ${GetDateNow()}`}</tt><br/>
      </div>
    </div>
  );
}

function footer(){
  return (
    <div style={footercss}>
      <div style={mapline}>
        <div>
        </div>
        <div>
        </div>
        <div>
          <font color="red" align="right">CONFIDENTIAL</font>
        </div>
      </div>
    </div>
  );
}

const dummycontents = markedex.markdownCreate(
  fs.readFileSync('dummy.md').toString()
);

function body(v){
  return (<div dangerouslySetInnerHTML={{__html: v}} />)
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const pages = [];
    dummycontents.forEach((v,i)=>{
      pages.push(
        <section key={i} style={sectioncss}>
        <div style={{"position" : "relative"}}>
        {header(parseInt(i)+1, dummycontents.length)}
        <div style={bodycss}>{body(v)}</div>
        {footer()}
        </div>
        </section>
      );
    })
    return (
      <div>
        {pages}
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
