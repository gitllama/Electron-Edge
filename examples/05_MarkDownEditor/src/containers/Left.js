import { connect } from 'react-redux';

import Left from '../components/Left';
import { changetext,increment } from '../actions';

function mapStateToProps(state) {
  return {state}
}

function mapDispatchToProps(dispatch) {
  return {
    handleonChange: (val) =>( dispatch(changetext(val)) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Left)
