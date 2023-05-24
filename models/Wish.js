const mongoose = require('mongoose');

const WishModel = new mongoose.Schema({
    yourWish: {
      type: String,
      required: true
    },
    // ability1: {
    //   type: String,
    //   required: true
    // },
    // ability2: {
    //     type: String,
    //     required: true
    //   },
    //   ability3: {
    //     type: String,
    //     required: true
    //   },
    author: {
      type: String,
      required: true
    },
    // image: {
    //   type: Object,
    //   required: false
    // }
  }, {timestamps: true});
  
  const Wish = mongoose.model('Wish', WishModel);


module.exports = Wish;