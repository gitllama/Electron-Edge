import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'

import SplitPane from 'react-split-pane';
import * as markedex from '../logic/marked-ex.js';

import Editor from './Editor.jsx'


const paneStyle = {
  overflow:"hidden",
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
const css_SplitPane={
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}
const Resizer  = {
  background: '#000',
  opacity: 0.2,
  zIndex : 1,
  width: '3px',
  cursor: 'col-resize',
};

const css_Right={
  background: '#FFF',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 1,
  overflowX : "auto",
  overflowY : "auto"
}


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <SplitPane split="vertical" defaultSize="50%"
        style={css_SplitPane} paneStyle ={paneStyle} resizerStyle={Resizer} >
        <Editor/>
        <div style={css_Right} dangerouslySetInnerHTML={
          {__html: markedex.markdownCreate(this.props.state.get("text"))}
        } />
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
