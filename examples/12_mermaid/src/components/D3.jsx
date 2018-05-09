import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';
import * as d3 from 'd3';

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
    svg.attr("height", 100)
        .attr("width", 100);
    svg.append("circle")
      .attr("cx",50)
      .attr("cy",50)
      .attr("r",20-this.props.state.get("count"))
      .attr("fill","green")
      .attr("stroke-width",3)
      .attr("stroke","orange");
    // console.log(prevProps.txt);
    // console.log(prevState.count);
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
