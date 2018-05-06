import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'
import Mermaid from './Mermaid.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  //shouldComponentUpdate(nextProps){
    //変更時のみrenderingロジックが走る
  //  return !Immutable.is(this.props.state, nextProps.state);
  //}
  render() {
    return (
      <div>
        {this.props.state.get("val")} {this.props.state.get("count")}
        <br/>
        <button type="button"
          onClick={()=>this.props.actions.sqlAsynclatest("SQL_ASYNCLATEST")}
        >CCC</button>
        <br/>
        <Mermaid />
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
