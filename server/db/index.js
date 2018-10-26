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
      ]);
    });
};

module.exports = {
  models: {
    User,
    Image
  },
  syncAndSeed
};
