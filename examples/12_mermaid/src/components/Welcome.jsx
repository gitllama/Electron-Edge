import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';


class App extends React.Component {
  constructor(props) {
    super(props);
    //this.inputRef = React.createRef();
  }
  // componentDidMount() {
  //   //this.inputRef.current.focus();
  // }
  // getSnapshotBeforeUpdate(prevProps, prevState){
  //   return null;
  // }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // if (nextProps.txt !== "") {
  //   //   return {
  //   //     count: prevState.count+1
  //   //   }
  //   // }
  //   return null;
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   // console.log(prevProps.txt);
  //   // console.log(prevState.count);
  // }
  // onChangeState(e){
  //   //this.setState({ world: e.target.value });
  // }
  render() {
    let html = this.props.state.get("html");
    return (
      <div>
        <img src="img/logo.svg" width="32" height="32" align="right"/>
        {
          (html != null)
            ? (<div dangerouslySetInnerHTML={{__html: html}} />)
            : <div>no data</div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({state}),
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
