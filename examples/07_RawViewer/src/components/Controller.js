import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
//import DnD from './DnD';
import * as actions from '../action'

const labelStyle = {
  display:"block",
  float:"left",
  width : "100px"
}
const inputStyle = {
  width : "100px"
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
  }
  onChange() {
    this.props.actions.changeparam({
      bitshift : this.bitshift.value,
      offset : this.offset.value
    });
  }
  onChangeSize() {
    this.props.actions.changesize(this.size.value);
  }
  onChangeType() {
    this.props.actions.changetype(this.type.value);
  }
  render() {
    return (
      <div style={this.props.style}>
        <form>
          <ul style={{ListStyleType: 'none'}}>
            <li>
              <label style={labelStyle}>FileType : </label>
              <select style={inputStyle}
                onChange={this.onChangeType}
                ref={node => this.type = node}
                value={this.props.state.get('type')}>
                <option value="Int32">Int32</option>
                <option value="Float32">Float32</option>
                <option value="DLL">DLL</option>
              </select>
            </li>
            <li>
              <label style={labelStyle}>bitshift : </label>
              <input style={inputStyle} type="number"
                value={this.props.state.get('bitshift')}
                ref={node => this.bitshift = node}
                onChange={this.onChange}
                />
            </li>
            <li>
              <label style={labelStyle}>offset : </label>
              <input style={inputStyle} type="number"
                value={this.props.state.get('offset')}
                ref={node => this.offset = node}
                onChange={this.onChange}
                />
            </li>
            <li>
              <label style={labelStyle}>size : </label>
              <input style={inputStyle} type="number"
                value={this.props.state.get('size')}
                ref={node => this.size = node}
                onChange={this.onChangeSize}
                />
            </li>
          </ul>
        </form>
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({
      actions: bindActionCreators(actions, dispatch)
  })
)(App)
