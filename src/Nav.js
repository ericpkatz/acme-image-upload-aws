import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Nav = ({ users, path })=> {
  const selected = (_path)=> {
    const style = {};
    if(_path === path){
      style.fontWeight = 'bold';
    }
    return style
  };

  return (
    <ul>
      <li style={selected('/')}><Link to='/'>Home</Link></li>
      <li style={ selected('/users')}><Link to='/users'>Users ({ users.length })</Link></li>
      <li style={ selected('/images')}><Link to='/images'>Images</Link></li>
    </ul>
  );
};

const mapStateToProps = ({ users })=> {
  return {
    users
  };
};
export default connect(mapStateToProps)(Nav);
