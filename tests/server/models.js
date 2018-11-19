const expect = require('chai').expect;
const { syncAndSeed, models } = require('../../server/db');
const { User } = models; 

describe('models', ()=> {
  beforeEach(()=> syncAndSeed());
  it('there are 3 users', ()=> {
    return User.findAll() 
      .then( users => expect(users.length).to.equal(3));
  });
});
