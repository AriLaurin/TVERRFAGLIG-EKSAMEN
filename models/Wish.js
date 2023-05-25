const mongoose = require('mongoose');

const WishModel = new mongoose.Schema({
    yourWish: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: false,
      default: 0
    }
  }, {timestamps: true});
  
  const Wish = mongoose.model('Wish', WishModel);


module.exports = Wish;