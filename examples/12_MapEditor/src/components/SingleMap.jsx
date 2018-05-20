import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';
import wfmap from '../logic/wfmap.js'


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.drawWfMap();
  }
  componentDidUpdate(prevProps, prevState) {
    //console.log(prevProps.state.get("count") === this.props.state.get("count"))
    //console.log(prevProps.state.get(mapconfig) === this.props.state.get(mapconfig))
    this.drawWfMap();
  }
  drawWfMap(){
    const node = this.node

    const mapconfig = this.props.state.get("mapconfig")["config"];
    const legend = this.props.state.get("legend");
    let wf = (this.props.state.get("wfmap") || {})[this.props.wfno];

    switch(this.props.mode){
      case "LEGEND":
        this.createLegend(node)
        break;
      case "SELECTABLE":
        this.createSelectable(node)
        break;
      default:
        this.createDefault(node)
        break;
    }

  }
  createLegend(node){
    wfmap.renderLegend(
      {
        "config" : this.props.state.get("mapconfig")["config"],
        "legend" : this.props.state.get("legend")
      }, node)
  }
  createSelectable(node){
    const wf = (this.props.state.get("wfmap") || {})[this.props.wfno];
    const selected = (this.props.state.get("selectchip") || {})[this.props.wfno] || {};
    if(wf){
      Object.keys(wf).forEach((v)=>{
        if(wf[v]["value"])
          wf[v]["value"] = selected[v] ? "0" : wf[v]["value"]
      })
      wfmap.render(
        {
          "title" : `${this.props.lotno}-${this.props.wfno}`,
          "caution" : wf ? null : "No Wf",
          "config" :  this.props.state.get("mapconfig")["config"],
          "legend" : this.props.state.get("legend"),
          "chip" : wf,
          "callback" : this.props.callback
        }, node)
    }else{
      this.createDefault(node)
    }
  }
  createDefault(node){
    let wf = (this.props.state.get("wfmap") || {})[this.props.wfno];
    wfmap.render(
      {
        "title" : `${this.props.lotno}-${this.props.wfno}`,
        "caution" : wf ? null : "No Wf",
        "config" :  this.props.state.get("mapconfig")["config"],
        "legend" : this.props.state.get("legend"),
        "chip" : wf
      }, node)
  }
  render() {
    return <svg ref={node => this.node = node}></svg>
  }

}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
