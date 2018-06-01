var mongoose = require('mongoose');
//Offers Schema
var alloffersSchema = mongoose.Schema({
  name: {
    type: String,
    index: true
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
  valid:{
    type: Boolean
  },
});
module.exports = mongoose.model('alloffers', alloffersSchema);
