const mongoose = require('mongoose');

const WishModel = new mongoose.Schema({
    yourWish: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  }, {timestamps: true});
  
  const Wish = mongoose.model('Wish', WishModel);


module.exports = Wish;