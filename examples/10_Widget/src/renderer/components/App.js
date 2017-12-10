import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';
import {
  Window,
  TitleBar,
  NavPane,
  NavPaneItem,
} from 'react-desktop/windows';
const ipcRenderer = require("electron").ipcRenderer;

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps){
    return !Immutable.is(this.props.state, nextProps.state);
  }
  render() {
    return (
      <div>
        {ipcRenderer.sendSync('get',"count")}
        <button type="button"
          onClick={()=> ipcRenderer.send("action", {type : "INC"})}
        >PATTERN_BASIC</button>
      </div>
    )
  }
}
//        {this.props.state.get("count")}
//this.props.actions.patternBasic("PATTERN_BASIC")

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
