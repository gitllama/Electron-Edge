import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';

import SingleMap from './SingleMap.jsx'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  onChange(e){
    this.props.actions.selectLegendAsynclatest(e)
  }
  onClick(e){
    this.props.actions.selectLegendAsynclatest(e)
  }
  render() {
    const wflist = [];
    const lotno = this.props.state.get("lotno");
    const wfnos = this.props.state.get("wfselect");
    for(var i of wfnos)
      wflist.push(
        <SingleMap lotno={lotno} wfno={i} mode="SELECTABLE" callback={(n)=>console.log(n)}/>
      );
    return (
      <div>
        <div>
          <img src="img/logo.svg" height="20mm" align="right"/>
          <h1 align="center">Wf Map{ this.props.state.get("selecttest") }</h1>
        </div>
        <div>
          <select name="month" onChange={(event)=>this.onChange(event.target.value)}>
          <option value="bin">bin</option>
          <option value="OS_Pch">OS_Pch</option>
          </select>
        </div>
        <div>
          <ul style={{"line-height": 15}}>
            <li><strong><pre style={{"display":"inline"}}>Date                  : </pre></strong>2018-5-12</li>
            <li><strong><pre style={{"display":"inline"}}>Desired delivery date : </pre></strong>2018-7-10</li>
            <li><strong><pre style={{"display":"inline"}}>LOT                   : </pre></strong>{lotno}</li>
          </ul>
        </div>
        <div>
          <SingleMap mode={"LEGEND"}/>
        </div>
        <div>
          {wflist}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
