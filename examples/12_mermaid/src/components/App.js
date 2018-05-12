import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'

import Mermaid from './Mermaid.jsx'
import WfMap from './WfMap.jsx'
import WfLegend from './WfLegend.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    //this.props.actions.sqlAsynclatest("SQL_ASYNCLATEST")
    //this.props.actions.readlogAsynclatest("")
  }
  //shouldComponentUpdate(nextProps){
    //変更時のみrenderingロジックが走る
  //  return !Immutable.is(this.props.state, nextProps.state);
  //}
  render() {
    const wflist = [];
    const lotno = this.props.state.get("lotno");
    const wfnos = this.props.state.get("wfselect");
    for(var i in wfnos)
      wflist.push(
        <WfMap lotno={lotno} wfno={i}/>
      );
    const viewselector =(i)=>{
      switch(i){
        case "WELCOME":
          return (
            <div>
              <img src="img/logo.svg" width="32" height="32" align="right"/>
              <h1 align="center">Welcome</h1>
            </div>
          )
        case "Mermaid":
          return <Mermaid />
        default:
          return (
            <div>
            <div>
              <img src="img/logo.svg" width="32" height="32" align="right"/>
              <h1 align="center">Wf Map</h1>
            </div>
              <div>
                <ul style={{"line-height": 15}}>
                  <li><strong><pre style={{"display":"inline"}}>Date                  : </pre></strong>2018-5-12</li>
                  <li><strong><pre style={{"display":"inline"}}>Desired delivery date : </pre></strong>2018-7-10</li>
                  <li><strong><pre style={{"display":"inline"}}>LOT                   : </pre></strong>{lotno}</li>
                </ul>
              </div>
              <div>
                <WfLegend />
              </div>
              <div>
                {wflist}
              </div>
            </div>
          );
      }
    }
    return (
      <div>{viewselector(this.props.state.get("view"))}</div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
