import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';
import * as d3 from 'd3';

const mapconfig = require('../../map.json');

class App extends React.Component {
  constructor(props) {
    super(props);
    //this.inputRef = React.createRef();
  }
  componentDidMount() {
    //this.inputRef.current.focus();
  }
  getSnapshotBeforeUpdate(prevProps, prevState){
    return null;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // if (nextProps.txt !== "") {
    //   return {
    //     count: prevState.count+1
    //   }
    // }
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    //count
    console.log(prevProps.state.get("count"));
    console.log(this.props.state.get("count"));

    const node = this.node
    var svg = d3.select(node)
    svg.selectAll("svg > *").remove();

    // svg.attr("height", 200)
    //    .attr("width", 200);
    //
    // svg.append("circle")
    //    .attr("cx",100)
    //    .attr("cy",100)
    //    .attr("r",100)
    //    .attr("fill","lightgray")
    //    .attr("stroke-width",1)
    //    .attr("stroke","black");

      this.wfCreate(svg);
       //.attr("r",10*this.props.state.get("count"))

  }
  wfCreate(svg){
    const offsetY =mapconfig["offsetY"]
    const offsetX = mapconfig["offsetX"]
    const chipSizeY = mapconfig["chipSizeY"]
    const chipSizeX = mapconfig["chipSizeX"]
    const countY = mapconfig["countY"]
    const countX = mapconfig["countX"]
    const edge = mapconfig["edge"]

    svg.attr("height", countY * chipSizeY)
       .attr("width", chipSizeX * countX);

    svg.append("circle")
       .attr("cx",100 + offsetX)
       .attr("cy",100 + offsetY)
       .attr("r",100)
       .attr("fill","lightgray")
       .attr("stroke-width",1)
       .attr("stroke","black");

       svg.append("circle")
          .attr("cx",100 + offsetX)
          .attr("cy",100 + offsetY)
          .attr("r",100-edge)
          .attr("fill","none")
          .attr("stroke-width",1)
          .attr("stroke","black");

        [...Array(countX+1)].map((_, n) =>
          svg.append("line")
          .attr("x1",n*chipSizeX)
          .attr("x2",n*chipSizeX)
          .attr("y1",0)
          .attr("y2",chipSizeY*(countY+1))
          .attr("stroke-width",1)
          .attr("stroke","black")
        );
        [...Array(countY+1)].map((_, n) =>
        svg.append("line")
        .attr("x1",0)
        .attr("x2",chipSizeX*(countX+1))
        .attr("y1",n*chipSizeY)
        .attr("y2",n*chipSizeY)
        .attr("stroke-width",1)
        .attr("stroke","black")
      );

      mapconfig["effective"].map((i)=>{
          svg.append("rect")
          .attr("x",chipSizeX * i["y"])
          .attr("y",chipSizeY * i["x"])
          .attr("width",chipSizeX)
          .attr("height",chipSizeY)
          .attr("fill","white")
          .attr("stroke-width",1)
          .attr("stroke","black");
          svg.append("text")
          .attr("x", chipSizeX * i["y"] + chipSizeX/2)
          .attr("y", chipSizeY * i["x"] + chipSizeY/2 + 6)
          .attr("text-anchor", "middle")
          .attr("font-family","sans-serif")
          .attr("font-size",12)
          .text(i["n"]);
        });
  }
  onChangeState(e){
    //this.setState({ world: e.target.value });
  }
  render() {

    return <svg ref={node => this.node = node}></svg>
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
