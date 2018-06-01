var mongoose = require('mongoose');
//User Schema
var blogSchema = mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  title:{
    type: String
  },
  category:{
    type: String
  },
  language:{
    type: String
  },
  description:{
    type: String
  },
  blogtext:{
    type: String
  },
  valid:{
    type: Boolean
  },
  upvote:{
    type: Number
  },
  viewed:{
    type: Number
  }
});

module.exports = mongoose.model('blog', blogSchema);

//module.exports.createBlog = function(newBlog, callback){
//    newBlog.save(callback);
//}
