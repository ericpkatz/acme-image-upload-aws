const conn = require('./conn');
const User = require('./User');
const Image = require('./Image');

const syncAndSeed = ()=> {
  return conn.sync({ force: true })
    .then(()=> {
      return Promise.all([
        //Image.create({ data: require('./_smiley')}),
        User.create({ name: 'moe', password: 'MOE' }),
        User.create({ name: 'larry', password: 'LARRY' }),
        User.create({ name: 'curly', password: 'CURLY' }),
        User.create({ name: 'shep', password: 'SHEP' }),
      ])
      .then(([moe, larry, curly, shep])=> {
        return Promise.all([
          larry.setManager(moe),
          curly.setManager(larry),
          shep.setManager(moe),
        ])
      })
      .then(()=> {
        return User.findAll();
      })
      .then( users => {
        const map = users.reduce((memo, user)=> {
          memo[user.name] = user;
          return memo; 
        }, {});
        return {
          users: map
        };
      })
    });
};

User.belongsTo(User, { as: 'manager' });

module.exports = {
  models: {
    User,
    Image
  },
  syncAndSeed
};
