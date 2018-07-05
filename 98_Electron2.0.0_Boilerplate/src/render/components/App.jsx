import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div>{this.props.state.get("text")}</div>);
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
