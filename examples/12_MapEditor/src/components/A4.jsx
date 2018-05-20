import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';
import SingleMap from './SingleMap.jsx'

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
  "justify-content": "space-between"
}

function GetDateNow(){
  const now = new Date();
  const y = now.getFullYear();
  const m = ("00" + (now.getMonth()+1)).slice(-2);
  const d = ("00" + now.getDate()).slice(-2);
  const w = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'][now.getDay()];

  return `${y}-${m}-${d}`;
}

function header(i, maxpage){
  return (
    <div style={headercss}>
      <img style={{"position" : "absolute", "left":"0mm", "top":"0mm", "height":"10mm"}} src="img/logo.svg"/>
      <div style={{"position" : "absolute", "left":"0mm", "top":"11mm", "fontSize" : "0.8em"}}>
        { i > 1 ? "工程指示書 ver 1.1" : "ver 1.1"}
      </div>
      <div style={{"position" : "absolute", "left":"150mm", "top":"0mm", "fontSize" : "0.8em"}}>
        <tt>{`PAGE            : ${i}/${maxpage}`}</tt><br/>
        <tt>{`Document Number : ${"BT2000-01"}`}</tt><br/>
        <tt>{`Date            : ${ GetDateNow()}`}</tt><br/>
      </div>
    </div>
  );
}

function footer(){
  return (
    <div style={footercss}>
      <div style={mapline}>
        <div>
          TO: 工程名
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

const dummy = ["A","B","C","D"]
const dummycontents = markedex.markdownCreate(
  fs.readFileSync('src/components/dummy.md').toString()
);


function body(i){
  switch(i){
    case "0":
      return (<div dangerouslySetInnerHTML={{__html: dummycontents}} />)
    case "1":
      return (
        <div>
          <div style={{"padding" : "2mm"}}>
            <SingleMap mode={"LEGEND"}/>
          </div>
          <div style={mapline}>
            <SingleMap lotno={""} wfno={1} />
            <SingleMap lotno={""} wfno={2} />
            <SingleMap lotno={""} wfno={3} />
          </div>
          <div style={mapline}>
            <SingleMap lotno={""} wfno={4} />
            <SingleMap lotno={""} wfno={5} />
            <SingleMap lotno={""} wfno={6} />
          </div>
          <div style={mapline}>
            <SingleMap lotno={""} wfno={7} />
            <SingleMap lotno={""} wfno={8} />
            <SingleMap lotno={""} wfno={9} />
          </div>
        </div>
      )
      case "2":
        return (
          <div>
            <div style={{"padding" : "2mm"}}>
              <SingleMap mode={"LEGEND"}/>
            </div>
            <div style={mapline}>
              <SingleMap lotno={""} wfno={10} />
              <SingleMap lotno={""} wfno={11} />
              <SingleMap lotno={""} wfno={12} />
            </div>
            <div style={mapline}>
              <SingleMap lotno={""} wfno={13} />
              <SingleMap lotno={""} wfno={14} />
              <SingleMap lotno={""} wfno={15} />
            </div>
            <div style={mapline}>
              <SingleMap lotno={""} wfno={16} />
              <SingleMap lotno={""} wfno={17} />
              <SingleMap lotno={""} wfno={18} />
            </div>
          </div>
        )
        case "3":
          return (
            <div>
              <div style={{"padding" : "2mm"}}>
                <SingleMap mode={"LEGEND"}/>
              </div>
              <div style={mapline}>
                <SingleMap lotno={""} wfno={19} />
                <SingleMap lotno={""} wfno={20} />
                <SingleMap lotno={""} wfno={21} />
              </div>
              <div style={mapline}>
                <SingleMap lotno={""} wfno={22} />
                <SingleMap lotno={""} wfno={23} />
                <SingleMap lotno={""} wfno={24} />
              </div>
              <div>
                <SingleMap lotno={""} wfno={25} />
              </div>
            </div>
          )
        default :
          return <div>err</div>
  }
}

// <div align="center">
//   <p style={{"fontSize" : "2em"}}><strong>工程指示書</strong></p>
// </div>

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const pages = [];
    for(var i in dummy)
      pages.push(
        <section style={sectioncss}>
          <div style={{"position" : "relative"}}>
            {header(parseInt(i)+1, dummy.length)}
            <div style={bodycss}>{body(i)}</div>
            {footer()}
          </div>
        </section>
      );
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
