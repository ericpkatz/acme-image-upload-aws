const S3 = require('../S3');

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

Image.upload = function(data, bucketName){
  return new Promise((resolve, reject)=> {
    const regex = /data:image\/(\w+);base64,(.*)/;
    const matches = regex.exec(data);
    if(!matches){
      return reject(new Error('BASE64 ERROR'));
    }
    const extension = matches[1];
    const image = this.build();
    const Key = `${image.id.toString()}.${extension}`;
    const Body = new Buffer(matches[2], 'base64');
    S3.createBucket({ Bucket: bucketName}).promise()
      .then(()=> {
        return S3.putObject({
          Bucket: bucketName,
          ACL: 'public-read',
          Body,
          ContentType: `image/${extension}`,
          Key
        }).promise();
      })
      .then( ()=> {
        image.url = `https://s3.amazonaws.com/${bucketName}/${Key}`;
        return image.save();
      })
      .then( image => resolve(image))
      .catch( ex => reject(ex));
  });
};
module.exports = Image;
