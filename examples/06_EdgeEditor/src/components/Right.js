import React from 'react';

class Right extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={this.props.style}>
        {this.props.state.get('output')}
      </div>
    );
  }
}
export default Right;
