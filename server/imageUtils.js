const S3 = require('./S3');
const gm = require('gm').subClass({imageMagick: true});

const parseBase64 = (data) => {
  const regex = /data:image\/(\w+);base64,(.*)/
  const matches = regex.exec(data);
  const extension = matches[1];

  const buffer = new Buffer(matches[2], 'base64');
  return { extension, buffer };
}

const resize = (bufferIn, extension) => {
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

const upload = async (buffer, extension, key, bucketName)=> {
    await S3.createBucket({ Bucket: bucketName}).promise();

    await S3.putObject({
      Bucket: bucketName,
      ACL: 'public-read',
      Body: buffer,
      ContentType: `image/${extension}`,
      Key: key
    }).promise();
}

module.exports = {
  parseBase64,
  resize,
  upload
};
