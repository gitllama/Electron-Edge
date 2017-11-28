import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import App from '../components/App'
// import { increment } from '../actions'
// import { csscript } from '../actions';
import * as actions from '../actions/'

function mapStateToProps(state) {
  return {state}
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
