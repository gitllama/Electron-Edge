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
    return !Immutable.is(this.props.state, nextProps.state);
  }
  render() {
    return (
      <div>
        TEST
      </div>
    )
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
// {this.props.state.get("val")} {this.props.state.get("count")}
// <br/>
// <button type="button"
//   onClick={()=> this.props.actions.patternBasic("PATTERN_BASIC")}
// >PATTERN_BASIC</button>
