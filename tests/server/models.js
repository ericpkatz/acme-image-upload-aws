const expect = require('chai').expect;
const { syncAndSeed, models } = require('../../server/db');
const { User, Image } = models; 

describe('models', ()=> {
  beforeEach(()=> syncAndSeed());
  it('there are 3 users', ()=> {
    return User.findAll() 
      .then( users => expect(users.length).to.equal(3));
  });

  describe('Image', ()=> {
    describe('with an invalid image', ()=> {
      it('fails', ()=> {
        return Image.upload('FOO')
          .then(()=> { throw 'nooo'; })
          .catch( ex => expect(ex.message).to.equal('BASE64 ERROR'));
      });
    });

    describe('with valid image', ()=> {
      it('can be uploaded', ()=> {
        const smiley = require('../../server/db/_smiley');
        return Image.upload(smiley, 'com.erickatz.a.bucket')
          .then( image => expect(image.url).to.equal(`https://s3.amazonaws.com/com.erickatz.a.bucket/${image.id}.jpeg`));
      });
    });
  });
});
