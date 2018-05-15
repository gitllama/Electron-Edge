import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable'

import Welcome from './Welcome.jsx'
import WfMap from './WfMap.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const viewselector =(i)=>{
      switch(i){
        case "MAIN":
          return ( <Welcome /> );
        default:
          return ( <WfMap /> );
      }
    }
    return (
      <div>{viewselector(this.props.state.get("view"))}</div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)

// exportSVG(path){
//   fs.writeFile(path, node.outerHTML, (err) => {
//     if (err) throw err;
//     console.log('save successful!');
//   });
// }
