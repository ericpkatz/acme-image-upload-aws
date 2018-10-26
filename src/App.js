import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadImages, reset, loadUsers, destroyUser } from './store';
import { Route, HashRouter as Router } from 'react-router-dom';
import Users from './Users';
import Nav from './Nav';
import UserUpdate from './UserUpdate';
import Images from './Images';

class App extends Component{
  componentDidMount(){
    this.props.init();
  }
  render(){
    const { users } = this.props;
    return (
      <div>
        <Router>
          <div>
            <Route component={ ({ location })=> <Nav path={ location.pathname }/> } />
            <Route exact path='/users' component={ Users } /> 
            <Route path='/users/:id' component={ UserUpdate } /> 
            <Route path='/images' component={ Images } /> 
          </div>
        </Router>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch)=> {
  return {
    init: ()=> {
      dispatch(loadUsers());
      dispatch(loadImages());
    }
  };
};

const mapStateToProps = ({ users })=> {
  return {
    users 
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
