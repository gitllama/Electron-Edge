import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'
const {webFrame} = require('electron')

import Editor from './Editor.jsx'
import A4 from './A4.jsx'
import Split from './Split.jsx'

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
  onmousewheel(i){
    if(i.ctrlKey){
      if(i.deltaY<0)
        webFrame.setZoomLevel(webFrame.getZoomLevel()+1);
      else if(i.deltaY>0)
        webFrame.setZoomLevel(webFrame.getZoomLevel()-1);
    }
      //console.log(i.deltaX,i.deltaY,i.deltaZ)
      //webFrame.setZoomFactor(webFrame.getZoomFactor()*2);
  }
  render() {
    const viewselector =(i)=>{
      switch(i){
        case "Editor":
          return ( <Editor/> );
        case "Split":
          return ( <Split /> );
        case "A4":
          return ( <A4 /> );
        default:
          return ( <div>ERR</div> );
      }
    }
    const busycheck =(i)=>{
      if(i)
        return <img style={loadimgstyle} src="img/loding.gif" />;
      else
        return viewselector(this.props.state.get("view"));
    }
    return (
      <div onWheel={(i) => this.onmousewheel(i)}>
        {busycheck(this.props.state.get("busy"))}
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
