import React from 'react';

import SplitPane from 'react-split-pane';
import Left from '../containers/Left';
import Right from '../containers/Right';
import key from 'keymaster'

const paneStyle = {
  overflow:"hidden",
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
const Resizer  = {
  background: '#000',
  opacity: 0.2,
  zIndex : 1,
  width: '3px',
  cursor: 'col-resize',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    key('left', ()=> {console.log("push left")});
    key('right', ()=> {console.log("push right")});
    // key('ctrl+r', ()=> {
    //   this.props.onScriptRun(this.props.state.get("input"));
    // });
  }
  render() {
    return (
      <SplitPane split="vertical" defaultSize="50%"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
        paneStyle ={paneStyle}
        resizerStyle={Resizer}>
        <Left style={{
          background: '#FFF',
          position: 'absolute',
          top: 0,
          right: 1,
          bottom: 0,
          left: 0
        }}/>
        <Right style={{
          background: '#FFF',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 1
        }}/>
      </SplitPane>
    )
  }
}
export default App;
