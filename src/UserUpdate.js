import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateUser } from './store';

class UserUpdate extends Component{
  constructor({ user }){
    super();
    this.state = {
      name: user ? user.name : ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onChange(ev){
    this.setState({[ev.target.name]: ev.target.value });
  }
  onSave(ev){
    ev.preventDefault();
    this.props.update({
      id: this.props.user.id,
      name: this.state.name
    })
  }
  componentDidUpdate(prevProps){
    if(!prevProps.user && this.props.user){
      this.setState({ name: this.props.user.name});
    } 
  }
  render(){
    const { name } = this.state;
    const { onChange, onSave } = this;
    return (
      <form onSubmit={ onSave }>
        <input name='name' value={ name } onChange={ onChange } />
        <button>Update</button>
      </form>
    );
  }
}

const mapStateToProps = ({ users } , { match })=> {
  const user = users.find( user => user.id === match.params.id*1);
  return {
    user
  };
}

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    update: (user )=> dispatch(updateUser(user, history))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);
