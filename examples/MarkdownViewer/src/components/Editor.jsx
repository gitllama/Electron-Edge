import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'

import AceEditor from 'react-ace';
import brace from 'brace';

require('brace/mode/markdown')
require('brace/snippets/markdown')
require('brace/theme/github')

const css_Left={
  background: '#FFF',
  position: 'absolute',
  top: 0,
  right: 1,
  bottom: 0,
  left: 0
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }
  onLoad(editor){
    // this.editor=editor;
    console.log('i\'ve loaded');
  }
  onChange(newValue){
    // console.log('change', newValue);
    this.props.actions.changeText(newValue);
  }
  onSelectionChange(newValue, event) {
    // console.log('select-change', newValue);
    // console.log('select-change-event', event);
  }
  onCursorChange(newValue, event) {
    // console.log('cursor-change', newValue);
    // console.log('cursor-change-event', event);
  }
  onValidate(annotations) {
    // console.log('onValidate', annotations);
  }
  setTheme(e) {
    this.setState({
      theme: e.target.value
    })
  }
  setMode(e) {
    this.setState({
      mode: e.target.value
    })
  }
  setBoolean(name, value) {
    this.setState({
      [name]: value
    })
  }
  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e.target.value,10)
    })
  }
  handleOnClick(){
    this.editor.insert("click!")
  }
  render() {
    return (
      <div style={css_Left}>
      <AceEditor width="100%" height="100%"
            mode='markdown' theme='github' name="blah2"
            fontSize={14}
            showPrintMargin={true} showGutter={true} highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            onLoad={this.onLoad}
            onChange={this.onChange}
            onSelectionChange={this.onSelectionChange}
            onCursorChange={this.onCursorChange}
            onValidate={this.onValidate}
            value={this.props.state.get('text')} />
        </div>
    )
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
