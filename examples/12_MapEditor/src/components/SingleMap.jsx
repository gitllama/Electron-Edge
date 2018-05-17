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
    const mapconfig = this.props.state.get("mapconfig");
    const lotstate = this.props.state.get("wfmap") || {};
    const wfstate = lotstate[this.props.wfno];

    switch(this.props.mode){
      case "LEGEND":
        wfmap.renderLegend(mapconfig, node)
        break;
      default:
        //configとmapのマージ
        if(wfstate){
          let hoge = Object.keys(wfstate).map((i)=> {return {
            "x" : wfstate[i]["x"],
            "y" : wfstate[i]["y"],
            "text" : wfstate[i]["bin"]
          }});

          wfmap.render(Object.assign({ "chip" :hoge }, mapconfig), node)
        } else {
          wfmap.render(mapconfig, node)
        }
        break;
    }

  }
  render() {
    return <svg ref={node => this.node = node}></svg>
  }

}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
