import React from 'react';
import { connect } from 'react-redux';

class App extends React.Component {
  render() {
    return (
      <div>
        <button
          onClick={ e => {this.props.dispatch({ type: "INCREMENT" });}}
          >{this.props.state.count}</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {state};
}

export default connect(mapStateToProps)(App);
