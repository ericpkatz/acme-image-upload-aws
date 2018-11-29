const S3 = require('../S3');
const gm = require('gm').subClass({imageMagick: true});

const conn = require('./conn');
const Image = conn.define('image', {
  id: {
    type: conn.Sequelize.UUID,
    defaultValue: conn.Sequelize.UUIDV4,
    primaryKey: true
  },
  url: {
    type: conn.Sequelize.STRING
  },
});

Image.parse = function(data){
  const regex = /data:image\/(\w+);base64,(.*)/;
  const matches = regex.exec(data);
  const extension = matches[1];
  const buffer = new Buffer(matches[2], 'base64');
  return {
    buffer, extension
  };
}
Image.resize = function(bufferIn, extension){
  return new Promise((resolve, reject)=> {
    gm(bufferIn)
      .resize(null, 50)
      .toBuffer(extension, (err, bufferOut)=> {
        if(err){
          return reject(err);
        }
        resolve(bufferOut);
      });
  });
}

Image.toAWS = function(buffer, extension, key, bucketName){
    return S3.createBucket({ Bucket: bucketName}).promise()
      .then(()=> {
        return S3.putObject({
          Bucket: bucketName,
          ACL: 'public-read',
          Body: buffer,
          ContentType: `image/${extension}`,
          Key: key
        }).promise();
      })
}

Image.upload = function(data, bucketName){
  return new Promise((resolve, reject)=> {
    let buffer, extension;
    try{
      const result = this.parse(data);
      buffer = result.buffer;
      extension = result.extension;
    }
    catch(ex){
      return reject(new Error('BASE64 ERROR'));
    }
    const image = this.build();
    const Key = `${image.id.toString()}.${extension}`;
    this.resize(buffer, extension)
    .then( buffer => this.toAWS(buffer, extension, Key, bucketName))
    .then( ()=> {
      image.url = `https://s3.amazonaws.com/${bucketName}/${Key}`;
      return image.save();
    })
    .then( image => resolve(image))
    .catch( ex => reject(ex));
  });
};
module.exports = Image;
