const expect = require('chai').expect;
const { models } = require('../../server/db')
const { Image } = models;

describe('models', ()=> {
  describe('Image', ()=> {
    it('is ok', ()=> {
      expect(Image).to.be.ok;
    });
  });
});
