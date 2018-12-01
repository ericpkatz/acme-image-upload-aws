const conn = require('./conn');
const User = conn.define('user', {
  name: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  hooks: {
    beforeUpdate: function(user){
      if(user._previousDataValues.managerId !== user.managerId){
        return User.findAll()
          .then( users => {
            return User.hier(user.managerId, users)
          })
          .then( hier => {
            if(hier.find(id => id === user.id)){
              throw new Error('CIRCULAR');
            }
          });

      }
    }
  }
});

User.hier = function(id, users){
  const map = users.reduce((memo, user)=> {
    memo[user.id] = user;
    return memo;
  }, {});
  let current = map[id];
  let ids = [];
  while(current){
    ids.push(current.id);
    current = map[current.managerId];
  }
  return ids;
};

module.exports = User;
