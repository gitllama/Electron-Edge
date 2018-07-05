import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import actions from '../../actions';
import Form from './A';
import Home from './Home';

class App extends React.Component {
  render() {
    return (

      <BrowserRouter>
        <div>
          <p><Link to='/A'>About</Link></p>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/A' component={Form} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(App);
