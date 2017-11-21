import React from 'react';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      world: "World"
    };
  }
  onChangeState(e){
    this.setState({ world: e.target.value });
  }
  render() {
    return (
      <div>
        <input type="text" defaultValue={this.state.world} onChange={this.onChangeState.bind(this)} />
        <p>Hello {this.state.world}!</p>
      </div>
    );
  }
}
