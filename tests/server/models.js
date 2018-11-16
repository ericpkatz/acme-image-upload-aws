const expect = require('chai').expect;
const { models } = require('../../server/db')
const { Image } = models;

describe('models', ()=> {
  describe('Image', ()=> {
    it('is ok', ()=> {
      expect(Image).to.be.ok;
    });
    it('can upload to S3', ()=> {
      const smiley = require('../../server/db/_smiley');
      expect(smiley).to.be.ok;
      'https://s3.amazonaws.com/com.erickatz.acme-image-upload-test/320dfdc3-4d37-4555-bbb6-19d01cbea06a.jpeg'
      return Image.upload(smiley, 'com.erickatz.acme-image-upload-test')
        .then( image=> expect(image.url).to.equal(`https://s3.amazonaws.com/com.erickatz.acme-image-upload-test/${image.id}.jpeg`));
    });
  });
});
