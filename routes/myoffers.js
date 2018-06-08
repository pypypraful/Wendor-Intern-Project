var express = require('express');
var router = express.Router();
var exphbs = require('express-handlebars');
var admin_offers = require('../models/admin_offers');

/* GET home page. */
router.get('/', function(req, res) {
  admin_offers.find({}).then((offers) =>{
    var categories = [];
    function include(arr,obj) {return (arr.indexOf(obj) != -1);}
    for(i=0;i<offers.length;i++) if (include(categories,offers[i].category)== false) categories.push(offers[i].category);
    console.log(categories);
    res.render('myoffers', { title: 'Wendor', offers:offers, categ:categories });
  },(error) => {
    if (error) throw err;
  });
});

module.exports = router;
