import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';
import * as d3 from 'd3';
import fs from 'fs';


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const node = this.node
    let legendbase = d3.select(node);
    //wf.selectAll("svg > *").remove();
    // .append('svg')
    //           .attr("xmlns",'http://www.w3.org/2000/svg')
    legendbase
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('version',  '1.1')
    .attr("width", 200)
    .attr("height", 100);
    legendbase.append("rect")
      .attr("x", 0).attr("y",0)
      .attr("width", 200).attr("height", 100)
      .attr("fill", "none");
    legendbase.append("g").selectAll()
      .data([0,1,2,3])
      .enter()
      .append("rect")
      .attr("x",(i)=> 10)
      .attr("y",(i)=> i * 15)
      .attr("width", 10)
      .attr("height", 10)
      .attr("stroke-width",1)
      .attr("stroke","black")
      .attr("fill",(i)=>{
        switch (i) {
          case 1:
            return "black";
          case 2:
            return "white";
          default:
            return "lightgray";
          }
      });
    legendbase.append("g").selectAll()
      .data([0,1,2,3])
      .enter()
      .append("text")
      .attr("x",(i)=> 25)
      .attr("y",(i)=> i * 15 + 5)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family","sans-serif")
      .attr("font-size",12)
      .text(i => `: ${i}`);
  }
  exportSVG(path){
    fs.writeFile(path, node.outerHTML, (err) => {
      if (err) throw err;
      console.log('save successful!');
    });
  }
  render() {
    return <svg ref={node => this.node = node}></svg>
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
