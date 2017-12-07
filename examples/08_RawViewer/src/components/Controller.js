import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'

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
    this.props.actions.changeParams({
      bitshift : this.bitshift.value,
      offset : this.offset.value
    });
    this.props.actions.reflashAsync();

    // this.props.actions.changeParamsAsync({
    //   bitshift : this.bitshift.value,
    //   offset : this.offset.value
    // });
  }
  onChangeSize() {
    this.props.actions.changeSize(this.size.value);
  }
  onChangeType() {
    this.props.actions.changeType(this.type.value);
  }
  render() {
    return (
      <div style={this.props.style}>
        <table>
        <tbody>
          <tr>
            <td style={labelStyle}>FileType : </td>
            <td>
              <select style={inputStyle}
                onChange={this.onChangeType}
                ref={node => this.type = node}
                value={this.props.state.get('type')}>
                <option value="Int8">Int32</option>
                <option value="UInt8">Float32</option>
                <option value="Int16">Int32</option>
                <option value="Uint16">Float32</option>
                <option value="Int32">Int32</option>
                <option value="Uint32">Float32</option>
                <option value="Float32">Int32</option>
                <option value="Float64">Float32</option>
                <option value="RAWPNG">RAWPNG</option>
                <option value="DLL">DLL</option>
              </select>
            </td>
          </tr>
          <tr>
            <td style={labelStyle}>bitshift : </td>
            <td>
              <input style={inputStyle} type="number"
                value={this.props.state.get('bitshift')}
                ref={node => this.bitshift = node}
                onChange={this.onChange}
                />
            </td>
          </tr>
          <tr>
            <td style={labelStyle}>offset : </td>
            <td>
              <input style={inputStyle} type="number"
                value={this.props.state.get('offset')}
                ref={node => this.offset = node}
                onChange={this.onChange}
                />
            </td>
          </tr>
          <tr>
            <td style={labelStyle}>size : </td>
            <td>
              <input style={inputStyle} type="number"
                value={this.props.state.get('size')}
                ref={node => this.size = node}
                onChange={this.onChangeSize}
                />
            </td>
          </tr>
          <tr>
            <td style={labelStyle}>Output : </td>
            <td>
              {this.props.state.get('message')}
            </td>
          </tr>
        </tbody>
        </table>
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
