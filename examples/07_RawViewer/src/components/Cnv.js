import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../action'

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps){
    const check =(e)=> this.props.state.get(e) != nextProps.state.get(e);

    if(check('imagedata')){
      console.log("imagedata update")
      let context = this.node.getContext('2d');
      //let src = context.getImageData(0, 0, this.props.state.get('width'), this.props.state.get('height'));
      context.putImageData(nextProps.state.get('imagedata'), 0, 0);
    }
    else if(check('file')){
      console.log("file update")
      this.props.actions.requestDecord({
          file : nextProps.state.get('file'),
          width : this.props.state.get('width'),
          height : this.props.state.get('height'),
          bitshift : this.props.state.get('bitshift'),
          offset : this.props.state.get('offset'),
          type : this.props.state.get('type')
      });
    }
    else if(check('bitshift') || check('offset')){
      this.props.actions.requestDecord({
          file : nextProps.state.get('file'),
          width : this.props.state.get('width'),
          height : this.props.state.get('height'),
          bitshift : this.props.state.get('bitshift'),
          offset : this.props.state.get('offset'),
          type : this.props.state.get('type')
      });
    }
  }
  componentDidMount() {
    this.node.ondragover =()=> false;
    this.node.ondragleave = this.node.ondragend = () => false;

    this.node.ondrop = ((e) => {
      e.preventDefault();
      let file = e.dataTransfer.files[0];
      console.log(file.path);
      this.props.actions.fileread(file);
      return false;
    }).bind(this);
  }
  render() {
    return (
      <div style={this.props.style}>
        <sub>{this.props.state.get('width')} x {this.props.state.get('height')} : {this.props.state.get('file').name}</sub><br/>
        <canvas ref={node => this.node = node}
          width={this.props.state.get('width')}
          height={this.props.state.get('height')}
          style={{width: (this.props.state.get('width') * this.props.state.get('size'))+"px"}}/>
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
