import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'
import Mermaid from './Mermaid.jsx'
import WfMap from './WfMap.jsx'

const wfArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
const LotName = "0001(AS5045)";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  //shouldComponentUpdate(nextProps){
    //変更時のみrenderingロジックが走る
  //  return !Immutable.is(this.props.state, nextProps.state);
  //}
  render() {
    const wflist = [];
    for(var i in wfArray) wflist.push( <WfMap lotno={LotName} wfno={i}/> );
    return (
      <div>
        {this.props.state.get("val")} {this.props.state.get("count")}
        <br/>
        <button type="button"
          onClick={()=>this.props.actions.patternDInc()}>debug1</button>
        <button type="button"
          onClick={()=>this.props.actions.sqlAsynclatest("SQL_ASYNCLATEST")}
        >debug1</button>
        <button type="button"
          onClick={()=>this.props.actions.readlogAsynclatest("")}
        >debug2</button>
        <br/>
        <Mermaid />
        <div>
          {wflist}
        </div>
      </div>
    )
  }
}
//{svg == null
//  ? <div>null</div>
//  : <div dangerouslySetInnerHTML={{__html: this.props.state.get("svg")}} />
//}
export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
