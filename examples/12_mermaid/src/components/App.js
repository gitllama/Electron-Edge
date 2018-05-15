import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'

import Welcome from './Welcome.jsx'
import WfMap from './WfMap.jsx'

const loadimgstyle = {
  "position": "absolute",
  "top":"0",
  "left":"0",
  "bottom":"0",
  "right":"0",
  "margin": "auto"
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const viewselector =(i)=>{
      switch(i){
        case "MAIN":
          return ( <Welcome /> );
        default:
          return ( <WfMap /> );
      }
    }
    const busycheck =(i)=>{
      if(i)
        return <img style={loadimgstyle} src="img/loding.gif" />;
      else
        return viewselector(this.props.state.get("view"));
    }
    return (<div>{busycheck(this.props.state.get("busy"))}</div>);
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
