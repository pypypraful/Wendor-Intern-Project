var express = require('express');
var router = express.Router();
var Jimp = require("jimp");

var admin_offers = require('../models/admin_offers');

/* GET admin page. */
router.get('/', function(req, res) {
  admin_offers.find({}).then((offers) =>{
    var categories = [];
    function include(arr,obj) {return (arr.indexOf(obj) != -1);}
    for(i=0;i<offers.length;i++) if (include(categories,offers[i].category)== false) categories.push(offers[i].category);
    console.log(categories);
    res.render('admin_offers', { title: 'Wendor',layout: 'admin-layout.handlebars', offers:offers, category:categories});
  },(error) => {
    if (error) throw error;
  });
});


var imgerr=0;
//Adding offer
//register User
router.post('/add',function(req,res){
  var name = req.body.offer_name;
  var price = req.body.price;
  var category = req.body.category;
  var shortinfo = req.body.shortinfo;
  var validity = req.body.validity;
  var fullinfo = req.body.fullinfo;
  var image = Jimp.read(req.body.offer_image).catch(function (err) {
                                                            console.error(err);
                                                            imgerr = err;
                                                            return null;
                                                              });

  //Validation
  req.checkBody('offer_name','Offer name is required').notEmpty();
  req.checkBody('price','Price is required').notEmpty();
  req.checkBody('category','Category is required').notEmpty();
  req.checkBody('shortinfo','Short Description is required').notEmpty();
  req.checkBody('validity','Validity is required').notEmpty();
  req.checkBody('fullinfo','Full description is required').notEmpty();


  var errors = req.validationErrors();

  if(errors){
    res.render('admin_offers',{
      errors: errors
    });
  } else{
    var newOffer = new admin_offers({
      name: name,
      price: price,
      category: category,
      shortinfo: shortinfo,
      validity: validity,
      fullinfo: fullinfo,
      offer_img_address: `/offerimages/${name}`
    });
    admin_offers.createOffer(newOffer, function(err,offer){
      if(err){
        res.render('admin_offers',{
        error:"Unique Offer name required"
      });
    }else{
      console.log(offer);
      if(!imgerr){
        image.resize(250, Jimp.AUTO);
        image.write(`/public/offerimages/`);
      }
      req.flash("success_msg",'New offer has been added');
      res.redirect('/admin_offers');
    }
    });
  }
});


module.exports = router;
