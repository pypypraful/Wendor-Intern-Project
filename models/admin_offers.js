var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
//Offers Schema
var alloffersSchema = mongoose.Schema({
  name: {
    type: String,
    index:true,
    unique: true
  },
  price:{
    type: String
  },
  category:{
    type: String
  },
  shortinfo:{
    type: String
  },
  fullinfo:{
    type: String
  },
  validity:{
    type: String
  },
  offer_img_address:{
    type: String
  }
});

alloffersSchema.plugin(uniqueValidator);

var admin_offers = module.exports = mongoose.model('admin_offers', alloffersSchema);

module.exports.createOffer = function(newOffer, callback){
  newOffer.save(callback);
}
