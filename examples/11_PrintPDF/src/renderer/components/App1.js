import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import actions from '../../actions';
import Form from './A';
// const sheet = {
//   width: '210mm',
//   height: '296mm', /* 1mm余裕をもたせる */
//   pageBreakAfter: 'always',
//   boxShadow: '0 .5mm 2mm rgba(0,0,0,.3)', /* ドロップシャドウ */
//   margin: '5mm',
//   background: 'white',
// };

class App extends React.Component {
  render() {
    return (
      <div>
        <section className="sheet">
          <Form />
        </section>
        <section className="sheet">
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
