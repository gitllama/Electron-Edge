import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../../actions';

class App extends React.Component {
  render() {
    return (
      <div>
        <section className="sheet">
          <p><Link to='/A'>About</Link></p>
          {this.props.state.getIn(['monitor', 'enable']).toString()}
          {this.props.state.get('count')}
        </section>
      </div>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(App);
