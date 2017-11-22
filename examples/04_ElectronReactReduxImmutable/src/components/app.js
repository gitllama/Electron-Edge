import React from 'react';
import { connect } from 'react-redux';
import { increment } from '../actions';

class App extends React.Component {
  render() {
    return (
      <div>
        <button
          onClick={(e) => this.props.dispatch(increment())}
          >{this.props.state.get("count")}</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {state};
}

export default connect(mapStateToProps)(App);
