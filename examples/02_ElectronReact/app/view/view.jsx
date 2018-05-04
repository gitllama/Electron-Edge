import React from 'react';

const ThemeContext = React.createContext('defaultValue');

function Output(props) {
  return (
    <ThemeContext.Consumer>
        {p => <p>{p}</p>}
    </ThemeContext.Consumer>
  );
}

class OutputTXT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  getSnapshotBeforeUpdate(prevProps, prevState){
    console.log('getSnapshotBeforeUpdate');
    return null;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps');
    if (nextProps.txt !== "") {
      return {
        count: prevState.count+1
      }
    }
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
    console.log(prevProps.txt);
    console.log(prevState.count);
  }
  render() {
    return (
      <div>
          {this.props.txt == ""
            ? ( <p>{this.state.count} : Hello Electron!</p> )
            : ( <p>{this.state.count} : Hello {this.props.txt}!</p> )
          }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();

    this.state = {
      count: 0,
      world: "World"
    };
  }
  componentDidMount() {
    this.inputRef.current.focus();
  }
  onChangeState(e){
    this.setState({ world: e.target.value });
  }
  render() {
    return (
      <div>
        <input type="text"
          defaultValue={this.state.world}
          onChange={this.onChangeState.bind(this)}
          ref={this.inputRef} />
        <div>
          <OutputTXT txt={this.state.world} />
        </div>
        <div>
          <Output/>
        </div>
      </div>
    );
  }
}

export default class Main extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value="dark">
        <App />
      </ThemeContext.Provider>
    );
  }
}
