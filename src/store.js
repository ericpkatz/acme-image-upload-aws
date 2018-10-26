const LOAD_USERS = 'LOAD_USERS';
const CREATE_USER = 'CREATE_USER';
const UPDATE_USER = 'UPDATE_USER';
const DESTROY_USER = 'DESTROY_USER';
const LOAD_IMAGES = 'LOAD_IMAGES';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import axios from 'axios';


const usersReducer = ( state = [], action)=> {
  switch(action.type){
    case LOAD_USERS:
      state = action.users;
      break;
    case CREATE_USER:
      state = [...state, action.user];
      break;
    case UPDATE_USER:
      state = state.map( user => user.id === action.user.id ? action.user : user );
      break;
    case DESTROY_USER:
      state = state.filter(user => user.id !== action.user.id);
      break;
  }
  return state;
};

const imagesReducer = ( state = [], action)=> {
  switch(action.type){
    case LOAD_IMAGES:
      state = action.images;
      break;
  }
  return state;
};

const reducer = combineReducers({
  users: usersReducer,
  images: imagesReducer
});

export default createStore(reducer, applyMiddleware(thunk));

const _loadImages = (images)=>({
  type: LOAD_IMAGES,
  images
});

const _loadUsers = (users)=>({
  type: LOAD_USERS,
  users
});

const _updateUser = (user)=>({
  type: UPDATE_USER,
  user
});

const _createUser = (user)=>({
  type: CREATE_USER,
  user
});

const _destroyUser = (user)=>({
  type: DESTROY_USER,
  user
});

const destroyUser = (user)=> {
  return (dispatch)=> {
    return axios.delete(`/api/users/${user.id}`)
      .then( response => response.data)
      .then( () => dispatch(_destroyUser(user))); 
  }
};

const createUser = (user)=> {

};
const updateUser = (user, history)=> {
  return (dispatch)=> {
    return axios.put(`/api/users/${user.id}`, user)
    .then( response => response.data)
    .then( user => dispatch(_updateUser(user)))
    .then( ()=> history.push('/users'));
  }

};
const loadUsers = ()=> {
  return (dispatch)=> {
    return axios.get('/api/users')
      .then( response => response.data)
      .then( users => dispatch(_loadUsers(users))); 
  }
};

const loadImages = ()=> {
  return (dispatch)=> {
    return axios.get('/api/images')
      .then( response => response.data)
      .then( images => dispatch(_loadImages(images))); 
  }
};

const createImage = (data)=> {
  return (dispatch)=> {
    return axios.post('/api/images', { data })
      .then( () => dispatch(loadImages())); 
  }
};

const reset = ()=> {
  return (dispatch)=> {
    return axios.post('/api/users/reset')
      .then( () => dispatch(loadUsers())); 
  }
};

export { createImage, loadImages, reset, destroyUser, createUser, updateUser, loadUsers };
