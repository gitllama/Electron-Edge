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
    //D&D設定
    this.node.ondragover =()=> false;
    this.node.ondragleave = this.node.ondragend = () => false;

    this.node.ondrop = ((e) => {
      e.preventDefault();
      let file = e.dataTransfer.files[0];
      this.props.actions.readFileAsync(file);
      return false;
    }).bind(this);

    //座標の表示
    this.node.addEventListener("mousemove", function(e){

    })
    this.node.addEventListener("mousedown", (e)=>{
      var rect = e.target.getBoundingClientRect();
      let width = this.props.state.get('width');
      let height = this.props.state.get('height');
      let size = this.props.state.get('size');

      var x = Math.floor((e.clientX - rect.left)/size);
      var y = Math.floor((e.clientY - rect.top)/size);

      x = x < 0 ? 0 : x > width ? width : x
      y = y < 0 ? 0 : y > height ? width : y

      let pix = this.props.state.get('rawdata')[x + y * width];
      console.log(x, y, pix);
    });

    //初期値強制再描画
    this.props.actions.reflashAsync();
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
