import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';
import * as d3 from 'd3';

const mapconfig = require('../../map.json');
const margin = {"top": 20, "left":20,"right":3,"bottom":3}

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
    let wf = d3.select(node)
    wf.selectAll("svg > *").remove();
    this.baseCreate(wf);
    this.wfCreate(wf);
    this.axisCreate(wf);
    this.gridCreate(wf);
    //this.chipStat(wf);

  }
  baseCreate(wf){
    const countX = mapconfig["countX"]
    const countY = mapconfig["countY"]
    const chipSizeX = mapconfig["chipSizeX"]
    const chipSizeY = mapconfig["chipSizeY"]
    wf.attr("height", chipSizeY * countY + margin.top + margin.bottom)
      .attr("width", chipSizeX * countX + margin.left + margin.right);
  }
  axisCreate(wf){
    const countX = mapconfig["countX"]
    const countY = mapconfig["countY"]
    const chipSizeX = mapconfig["chipSizeX"]
    const chipSizeY = mapconfig["chipSizeY"]
    wf.selectAll("rect")
      .data([...Array(countX)])
      .enter()
      .append("text")
      .attr("x", (_, i) => margin.left + chipSizeX * (i + 0.5))
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family","sans-serif")
      .attr("font-size",12)
      .text((_, i) => i);
    wf.selectAll("rect")
      .data([...Array(countY)])
      .enter()
      .append("text")
      .attr("x", margin.left / 2)
      .attr("y", (_, i) => margin.top + chipSizeY * (i + 0.5))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family","sans-serif")
      .attr("font-size",12)
      .text((_, i) => i);
  }
  wfCreate(wf){
    const offsetX = mapconfig["offsetX"] + margin.left
    const offsetY = mapconfig["offsetY"] + margin.top
    const chipSizeX = mapconfig["chipSizeX"]
    const chipSizeY = mapconfig["chipSizeY"]
    const countX = mapconfig["countX"]
    const countY = mapconfig["countY"]
    const edge = mapconfig["edge"]

    const notchside = 0
    wf.append("circle")
       .attr("cx",100 + offsetX )
       .attr("cy",100 + offsetY )
       .attr("r",100)
       .attr("fill","lightgray")
       .attr("stroke-width",2)
       .attr("stroke","black");
    wf.append("circle")
      .attr("cx",100 + offsetX)
      .attr("cy",100 + offsetY)
      .attr("r",100 - edge)
      .attr("fill","none")
      .attr("stroke-width",1)
      .attr("stroke","black");
    wf.append('line')
      .attr("x1",100 + offsetX + (100 - 9) * Math.cos((notchside)*Math.PI/180))
      .attr("y1",100 + offsetY + (100 - 9) * Math.sin((notchside)*Math.PI/180))
      .attr("x2",100 + offsetX + 100 * Math.cos((notchside+4)*Math.PI/180))
      .attr("y2",100 + offsetY + 100 * Math.sin((notchside+4)*Math.PI/180))
      .attr("stroke-width",2)
      .attr("stroke","black");
    wf.append('line')
      .attr("x1",100 + offsetX + (100 - 9) * Math.cos((notchside)*Math.PI/180))
      .attr("y1",100 + offsetY + (100 - 9) * Math.sin((notchside)*Math.PI/180))
      .attr("x2",100 + offsetX + 100 * Math.cos((notchside-4)*Math.PI/180))
      .attr("y2",100 + offsetY + 100 * Math.sin((notchside-4)*Math.PI/180))
      .attr("stroke-width",2)
      .attr("stroke","black");
  }

  gridCreate(wf){
    const chipSizeX = mapconfig["chipSizeX"];
    const chipSizeY = mapconfig["chipSizeY"];
    const countX = mapconfig["countX"];
    const countY = mapconfig["countY"];

    let x = Array.from(new Array(countX+1),(v,i)=>{
      return {
        "x1" : i*chipSizeX + margin.left,
        "x2" : i*chipSizeX + margin.left,
        "y1" : margin.top,
        "y2" : chipSizeY*countY + margin.top
      }
    });
    let y = Array.from(new Array(countY+1),(v,i)=>{
      return {
        "x1" : margin.left,
        "x2" : chipSizeX*countX + margin.left,
        "y1" : i*chipSizeY + margin.top,
        "y2" : i*chipSizeY + margin.top
      }
    });
    console.log(x.concat(y));
    wf.selectAll("line")
      .data(x.concat(y))
      .enter()
      .append("line")
      .attr("x1",(n) => n["x1"])
      .attr("x2",(n) => n["x2"])
      .attr("y1", (n) => n["y1"])
      .attr("y2", (n) => n["y2"])
      .attr("stroke-width",1)
      .attr("stroke","black")
      .attr("stroke-dasharray", "1, 1");
  }
  chipStat(wf){
    const chipSizeY = mapconfig["chipSizeY"]
    const chipSizeX = mapconfig["chipSizeX"]

    var svgCircle = wf.selectAll("rect")
    	.data(mapconfig["effective"])
    	.enter()
      .append("rect")
      .attr("x",(i)=>chipSizeX * i["y"] + margin.left)
      .attr("y",(i)=>chipSizeY * i["x"] + margin.top)
      .attr("width",chipSizeX)
      .attr("height",chipSizeY)
      .attr("fill","white")
      .attr("stroke-width",1)
      .attr("stroke","black");

    //     svg.append("text")
    //     .attr("x", chipSizeX * (i["y"] + 0.5))
    //     .attr("y", chipSizeY * (i["x"] + 0.5))
    //     .attr("text-anchor", "middle")
    //     .attr("dominant-baseline", "middle")
    //     .attr("font-family","sans-serif")
    //     .attr("font-size",12)
    //     .text(i["n"]);
    //   });
  }
  chipClickable(wf){
    const chipSizeY = mapconfig["chipSizeY"]
    const chipSizeX = mapconfig["chipSizeX"]
    mapconfig["effective"].map((i)=>{
        wf.append("rect")
        .on("click",d=>console.log("aaa"))
        .attr("x",chipSizeX * i["y"])
        .attr("y",chipSizeY * i["x"])
        .attr("width",chipSizeX)
        .attr("height",chipSizeY)
        .attr("fill","red")
        .attr("stroke-width",1)
        .attr("stroke","red");
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
//this.chipClickable(svg);
//.attr("r",10*this.props.state.get("count"))

// let innerarc = d3.arc()
//     .innerRadius(99 - edge)
//     .outerRadius(100 - edge)
//     .startAngle((notchside + 3) * (Math.PI/180))
//     .endAngle((notchside + 357) * (Math.PI/180));
// wf.append("path")
//   .attr("d", outerarc)
//   .attr("transform", `translate(${100 + offsetX},${100 + offsetY})`)
//   .style("fill", "red");


    // [...Array(countY+1)].map((_, n) =>
    // );
