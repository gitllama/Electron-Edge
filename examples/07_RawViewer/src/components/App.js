import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SplitPane from 'react-split-pane';
import * as actions from '../actions/action'

import Cnv from './Cnv';
import Controller from './Controller';

const paneStyle = {
  overflow:"hidden",
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
const ResizerStyle  = {
  background: '#000',
  opacity: 0.2,
  zIndex : 1,
  width: '3px',
  cursor: 'col-resize',
};
const SplitPaneStyle  = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
const LeftStyle = {
  background: '#FFF',
  position: 'absolute',
  top: 0,
  right: 1,
  bottom: 0,
  left: 0
}
const RightStyle = {
  background: '#FFF',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 1,
  overflow : 'auto'
}


class App extends React.Component {
  constructor(props) {
    super(props);
    // const ipcRenderer = require("electron").ipcRenderer;
    // ipcRenderer.on('runEdge', (event, param) => {
    //   store.dispatch(runEdge(store.getState().get("input")));
    // });

  }
  render() {
    return (
      <SplitPane split="vertical" defaultSize="50%"
        style={SplitPaneStyle}
        paneStyle ={paneStyle}
        resizerStyle={ResizerStyle}>
        <Controller style={LeftStyle}/>
        <Cnv style={RightStyle}/>
      </SplitPane>
    )
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
