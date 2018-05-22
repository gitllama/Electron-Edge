import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';

import fs from 'fs';
import * as markedex from '../logic/marked-ex.js';

const header_height = 18
const footer_height = 3

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
const cssCaution={
  "textAlign" : "",
  "position": "absolute",
  "left":"0mm",
  "top":"100mm",
  "opacity":"0.3",
  "width":"210mm",
  "zIndex" : "0",
  "height": `${296 - header_height - footer_height}mm`,
  "fontSize" : "8em",
  "transform": "rotate(-35deg)",
  "fontWeight": "900"
}


function GetDateNow(){
  const now = new Date();
  const y = now.getFullYear();
  const m = ("00" + (now.getMonth()+1)).slice(-2);
  const d = ("00" + now.getDate()).slice(-2);
  const w = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'][now.getDay()];

  return `${y}-${m}-${d}`;
}
function PadLeft(i,n){
  return ([...Array(n)].reduce((v)=> v + " ") + i).slice(-1*n);
}

function header(page,title,docNo){
  return (
    <div style={headercss}>
      <img style={{"position" : "absolute", "left":"0mm", "top":"0mm", "height":"10mm"}} src="img/logo.svg"/>
      <div style={{"position" : "absolute", "left":"0mm", "top":"11mm", "fontSize" : "0.8em"}}>{title}</div>
      <div style={{"position" : "absolute", "left":"165mm","top":"4mm", "fontSize" : "0.8em"}}>
        <pre>
          {"No.  : " + PadLeft(docNo,18)}<br/>
          {"Date : " + PadLeft(GetDateNow(),18)}<br/>
          {"Page : " + PadLeft(page,18)}
        </pre>
      </div>
    </div>
  );
}

function footer(){
  return (
    <div style={mapline}>
      <div></div>
      <div></div>
      <div>
        <font color="red" align="right">CONFIDENTIAL</font>
      </div>
    </div>
  );
}


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const pages = [];
    let hoge = markedex.markdownCreate(this.props.state.get("text"), true, (code)=>{
      let hoge = JSON.parse(code);
      console.log(hoge)
    });
    hoge.forEach((v,i)=>{
      pages.push(
        <section key={i} style={sectioncss}>
          <div style={{"position" : "relative"}}>
            {header(
              `${parseInt(i)+1}/${hoge.length}`,
              this.props.state.get("title"),
              this.props.state.get("docNo")
            )}
            <div style={cssCaution}>ドラフトですよ！</div>
            <div style={bodycss} dangerouslySetInnerHTML={{__html: v}} />
            <div style={footercss}>{footer()}</div>
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
