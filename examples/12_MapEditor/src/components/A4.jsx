import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';

const ccsstyle = {
  "width":"210mm",
  "height":"296mm", /* 1mm余裕をもたせる */
  "pageBreakAfter": "always"
}
const dummy = ["A","B","C"]

const header = {
  "borderWidth":"1px",
  "borderStyle":"solid",
  "height":"50mm"
}
const body = {
  "borderWidth":"1px",
  "borderStyle":"solid",
  "height":"196mm"
}
const footer =  {
  "borderWidth":"1px",
  "borderStyle":"solid",
  "height":"50mm"
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const pages = [];
    for(var i in dummy)
      pages.push(
        <section style={ccsstyle}>
          <div style={header}>
            <img src="img/logo.svg" width="32" height="32" align="right"/>
            <div align="right">
              <p>{`${i}/${dummy.length}`}</p>
            </div>
            <div align="center">
              <p>{`${dummy[i]}`}</p>
            </div>
          </div>
          <div style={body}>ボディー</div>
          <div style={footer}>フッター</div>

        </section>
      );
    return (
      <div>
        {pages}
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
