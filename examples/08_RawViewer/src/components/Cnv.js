import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions'
import Immutable from 'immutable';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.node.ondragover =()=> false;
    this.node.ondragleave = this.node.ondragend = () => false;

    this.node.ondrop = ((e) => {
      e.preventDefault();
      let file = e.dataTransfer.files[0];
      this.props.actions.readFileAsync(file);
      return false;
    }).bind(this);

    this.props.actions.reflashAsync(); //初期値強制再描画
  }
  shouldComponentUpdate(nextProps){
    //変更時のみrenderingロジックが走る
    //Immutable.is()とのパフォーマンス比較
    return !Immutable.is(this.props.state, nextProps.state);
  }
  componentWillReceiveProps(nextProps){
    const check =(e)=> this.props.state.get(e) != nextProps.state.get(e); //== === 動作違い
    if(check('imagedata')){
      let context = this.node.getContext('2d');
      context.putImageData(nextProps.state.get('imagedata'), 0, 0);
    }
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
  dispatch =>({ actions: bindActionCreators(actions, dispatch) })
)(App)
