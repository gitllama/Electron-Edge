import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps){
    //変更時のみrenderingロジックが走る
    return !Immutable.is(this.props.state, nextProps.state);
  }
  render() {
    return (
      <div>
        {this.props.state.get("val")} {this.props.state.get("count")}
        <br/>
        <button type="button"
          onClick={()=> this.props.actions.patternBasic("PATTERN_BASIC")}
        >PATTERN_BASIC</button>
        <br/>
        <br/>
        <button type="button"
          onClick={()=> this.props.actions.patternC("PATTERN_C")}
        >PATTERN_C</button>
        <br/>
        <br/>
        <button type="button"
          onClick={()=> this.props.actions.patternDAsync("PATTERN_D_ASYNC")}
        >PATTERN_D_ASYNC</button>
        <br/>
        <button type="button"
          onClick={()=>this.props.actions.patternDThrough("PATTERN_D_THROUGH")}
        >PATTERN_D_THROUGH</button>
        <br/>
        <br/>
        <button type="button"
          onClick={()=>this.props.actions.patternDInc("PATTERN_D_INC")}
        >PATTERN_D_INC</button>
        <br/>
        <button type="button"
          onClick={()=>this.props.actions.patternDIncAsync("PATTERN_D_INC_ASYNC")}
        >PATTERN_D_INC_ASYNC</button>
        <br/>
        <button type="button"
          onClick={()=>this.props.actions.patternDIncAsynclatest("PATTERN_D_INC_ASYNCLATEST")}
        >PATTERN_D_INC_ASYNCLATEST</button>
      </div>
    )
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
