const mongoose = require('mongoose');

const imageModel = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
        type: String,
        required: true
      },
    key: {
        type: String,
        required: true
    }
  });
  
  const Image = mongoose.model('Image', imageModel);


module.exports = Image;