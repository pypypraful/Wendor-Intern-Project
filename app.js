var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wendor');
var db = mongoose.connection;





var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admin_offersRouter = require('./routes/admin_offers');
var myprofileRouter = require('./routes/myprofile');
var myoffersRouter = require('./routes/myoffers');
var machinesRouter = require('./routes/machines');

//Init App
var app = express();

//View Engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout: 'layout'}));
app.set('view engine','handlebars');

app.use(logger('dev'));

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//For cookies
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave:false
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '['+ namespace.shift()+ ']';
    }
  return {
    param: formParam,
    msg: msg,
    value: value
  };
  }
}));

//Connect flash
app.use(flash());


//Global vars
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.success = req.flash('success');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});





app.use('/admin_offers',admin_offersRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/myprofile',myprofileRouter);
app.use('/myoffers',myoffersRouter);
app.use('/machines',machinesRouter);


//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 3000);
  res.render('error');
});

module.exports = app;
