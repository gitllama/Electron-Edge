import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'

import Welcome from './Welcome.jsx'
import WfMap from './WfMap.jsx'
import A4 from './A4.jsx'

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
    //const configJson = this.props.state.get("config");
    //this.props.actions.readwelcomeAsynclatest(`${configJson["data"]["path"]}/welcome.md`)
  }
  // componentDidMount() {
  //   const ipcRenderer = require("electron").ipcRenderer;
  //   ipcRenderer.send('async', null);
  //     console.log("s")
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevProps);
  //   console.log(prevState);
  // }
  // getSnapshotBeforeUpdate(prevProps, prevState){
  //   return null;
  // }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // if (nextProps.txt !== "") {
  //   //   return {
  //   //     count: prevState.count+1
  //   //   }
  //   // }
  //   return null;
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   // console.log(prevProps.txt);
  //   // console.log(prevState.count);
  // }
  // onChangeState(e){
  //   //this.setState({ world: e.target.value });
  // }
  render() {
    const viewselector =(i)=>{
      switch(i){
        case "MAIN":
          return ( <Welcome /> );
        case "A4":
          return ( <A4 /> );
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
