import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Right from '../components/Right';
import * as actions from '../actions/'

function mapStateToProps(state) {
  return {state}
}

function mapDispatchToProps(dispatch) {
  return {
    handleonChange: (val) =>( dispatch(changetext(val)) )
  }
}

export default connect(mapStateToProps, null)(Right)
