import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let html = this.props.state.get("html");
    return (
      <div>
        <img src="img/logo.svg" height="20mm" align="right"/>
        {
          (html != null)
            ? (<div dangerouslySetInnerHTML={{__html: html}} />)
            : <div>no data</div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
