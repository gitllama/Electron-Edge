import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Left from '../components/Left';
//import { changetext,increment } from '../actions';
import * as actions from '../actions'

function mapStateToProps(state) {
  return {state}
}

// function mapDispatchToProps(dispatch) {
//   return {
//     handleonChange: (val) =>( dispatch(changetext(val)) )
//   }
// }
function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(actions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Left)
