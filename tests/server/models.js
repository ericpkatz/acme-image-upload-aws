const expect = require('chai').expect;
const { syncAndSeed, models } = require('../../server/db');
const { User, Image } = models; 
const sinon = require('sinon');

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
      let parse, toAWS, resize;
      beforeEach(()=> {
        parse = sinon.stub(Image, 'parse');
        parse.withArgs('ABC').returns({ buffer: 'DEF', extension: 'png'});

        resize = sinon.stub(Image, 'resize');
        resize.withArgs('DEF', 'png').returns(Promise.resolve('RESIZED'));

        toAWS = sinon.stub(Image, 'toAWS');
        toAWS.withArgs('RESIZED', 'png').returns(Promise.resolve());
      });
      afterEach(()=> {
        parse.restore();
        resize.restore();
        toAWS.restore();
      });
      it('can be uploaded', ()=> {
        return Image.upload('ABC', 'bucket')
          .then( image => expect(image.url).to.equal(`https://s3.amazonaws.com/bucket/${image.id}.png`));
      });
    });
  });
});
