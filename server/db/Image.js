const { parseBase64, upload, resize } = require('../imageUtils');


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


Image.upload = async function(data, bucketName){
  try{
    const image = this.build();

    const { buffer, extension } = parseBase64(data);

    const _buffer = await resize(buffer);

    const key = `${image.id.toString()}.${extension}`;
    await upload(_buffer, extension, key, bucketName);

    
    image.url = `https://s3.amazonaws.com/${bucketName}/${key}`;
    return await image.save();
  }
  catch(ex){
    throw ex;
  }
}
module.exports = Image;
