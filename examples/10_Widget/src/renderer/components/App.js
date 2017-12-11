import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import Immutable from 'immutable';

// import {
//   Window,
//   TitleBar,
//   NavPane,
//   NavPaneItem,
// } from 'react-desktop/windows';


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  // shouldComponentUpdate(nextProps){
  //   return !Immutable.is(this.props.state, nextProps.state);
  // }
  render() {
    return (
      <div>
        {this.props.state.getIn(["monitor","enable"]).toString()}
        <br/>
        {this.props.state.get("count")}
        <button type="button"
          onClick={()=> this.props.actions.changeInc()}
        >PATTERN_BASIC</button>
      </div>
    )
  }
}
//        {ipcRenderer.sendSync('get',"count")}
//        {this.props.state.get("count")}
//this.props.actions.patternBasic("PATTERN_BASIC")
// /ipcRenderer.send("action", {type : "INC"}
export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
