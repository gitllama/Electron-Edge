import { connect } from 'react-redux'

import App from '../components/App'
import { increment } from '../actions'

function mapStateToProps(state) {
  return {state}
}

function mapDispatchToProps(dispatch) {
  return {
    onIncrement: () => { dispatch(increment()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
