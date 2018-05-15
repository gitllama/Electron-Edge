import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';

import SingleMap from './SingleMap.jsx'


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const wflist = [];
    const lotno = this.props.state.get("lotno");
    const wfnos = this.props.state.get("wfselect");
    for(var i of wfnos)
      wflist.push(
        <SingleMap lotno={lotno} wfno={i} mode={"TEXT | BIN"}/>
      );
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
