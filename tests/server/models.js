const expect = require('chai').expect;
const { syncAndSeed, models } = require('../../server/db');
const { User, Image } = models; 
const sinon = require('sinon');

describe('models', ()=> {
  let seed;
  beforeEach(()=> { 
    return syncAndSeed()
      .then(_seed => seed = _seed);
  });
  it('there are 4 users', ()=> {
    return User.findAll() 
      .then( users => expect(users.length).to.equal(4));
  });
  it('moe is one of them', ()=> {
    console.log(seed);
    expect(seed.users.moe.name).to.equal('moe');
  });

  describe('hier', ()=> {
    it('can compute hier for curly', ()=> {
      return User.findAll()
        .then( users => User.hier(seed.users.curly.id, users))
        .then( ids => expect(ids).to.eql([ seed.users.curly.id, seed.users.larry.id, seed.users.moe.id]));

    });
    it('can compute hier for moe', ()=> {
      return User.findAll()
        .then( users => User.hier(seed.users.moe.id, users))
        .then( ids => expect(ids).to.eql([ seed.users.moe.id]));

    });
  });
  describe('hierarchy', ()=> {
    it('shep can be managed by larry', ()=> {
      return seed.users.shep.setManager(seed.users.larry)
        .then(()=> seed.users.shep.getManager())
        .then( manager => expect(manager.name).to.equal('larry'));

    });
    it('shep can be managed by curly', ()=> {
      return seed.users.shep.setManager(seed.users.curly)
        .then(()=> seed.users.shep.getManager())
        .then( manager => expect(manager.name).to.equal('curly'));

    });
    it('larry can not be managed by curly', ()=> {
      return seed.users.larry.setManager(seed.users.curly)
        .then(()=> {
          throw new Error('noooo');
        })
        .catch(ex => expect(ex.message).to.equal('CIRCULAR'));
    });
    it('larry can not be manage by larry', ()=> {
      return seed.users.larry.setManager(seed.users.larry)
        .then(()=> {
          throw new Error('noooo');
        })
        .catch(ex => expect(ex.message).to.equal('CIRCULAR'));
    });
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
