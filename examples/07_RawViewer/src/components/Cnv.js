import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/action'
import Immutable from 'immutable';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps){
    //console.log("sc : ", Immutable.is(nextProps.state, this.props.state) );
    return true;
  }
  componentWillReceiveProps(nextProps){
    const check =(e)=> this.props.state.get(e) != nextProps.state.get(e);
    //Immutable.is()とのパフォーマンス比較、== === 動作違い

    if(check('imagedata')){
      console.log("imagedata update")
      let context = this.node.getContext('2d');
      context.putImageData(nextProps.state.get('imagedata'), 0, 0);
    }
    else if(check('rawdata') || check('bitshift') || check('offset')){
      console.log("raw update",check('rawdata') ,check('bitshift') ,check('offset'))
      this.props.actions.requestDecordAsync({
          rawdata : nextProps.state.get('rawdata'),
          width : nextProps.state.get('width'),
          height : nextProps.state.get('height'),
          bitshift : nextProps.state.get('bitshift'),
          offset : nextProps.state.get('offset')
      });
    }
  }
  componentDidMount() {
    this.node.ondragover =()=> false;
    this.node.ondragleave = this.node.ondragend = () => false;

    this.node.ondrop = ((e) => {
      e.preventDefault();
      let file = e.dataTransfer.files[0];
      this.props.actions.readFileAsync({
        file : file,
        type : this.props.state.get('type')
      });
      return false;
    }).bind(this);

    this.props.actions.requestDecordAsync({
        rawdata : this.props.state.get('rawdata'),
        width : this.props.state.get('width'),
        height : this.props.state.get('height'),
        bitshift : this.props.state.get('bitshift'),
        offset : this.props.state.get('offset')
    });
  }
  render() {
    return (
      <div style={this.props.style}>
        <sub>{this.props.state.get('width')} x {this.props.state.get('height')} : {this.props.state.get('filename')}</sub><br/>
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
