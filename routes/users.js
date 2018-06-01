var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
//register
router.get('/register',function(req,res){
  res.render('register');
});

//Login
router.get('/login',function(req, res){
  res.render('login');
});

//register User
router.post('/register',function(req,res){
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var username = req.body.username;
  var email = req.body.email;
  var password1 = req.body.password1;
  var password2 = req.body.password2;
  var number = req.body.number;


  //Validation
  console.log('1');
  req.checkBody('first_name','Name is required').notEmpty();
  console.log('2');
  req.checkBody('username','Username is required').notEmpty();
  console.log('3');
  req.checkBody('email','E-mail is required').notEmpty();
  console.log('4');
  req.checkBody('email','E-mail is not valid').isEmail();
  console.log('5');
  req.checkBody('password1','Password is required').notEmpty();
  console.log('6');
  req.checkBody('password2','Passwords do not match').equals(req.body.password1);
  console.log('7');
  req.checkBody('number','Phone Number is required').notEmpty();
console.log('hey joekhd h');
  var errors = req.validationErrors();
  if(errors){
    res.render('register',{
      errors: errors
    });
  } else{
    var newUser = new User({
      name: firstname+""+lastname,
      email: email,
      username: username,
      password: password1,
      number: number
    });

    User.createUser(newUser, function(err,user){
      if(err) throw err;
      console.log(user);
    });

    req.flash("success_msg",'You are registered and now you can login');

    res.redirect('/users/login');
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null,false, {message: 'Unknown User'});
      }
      User.comparePassword(password, user.password, function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,user);
        } else{
          return done(null, false, {message: 'Invalid Password'});
        }
      });
    });
  }));

passport.serializeUser(function(user,done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});

router.post('/login',
passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
function(req,res){
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', "You are logged out");
  res.redirect('/users/login');
});


module.exports = router;
