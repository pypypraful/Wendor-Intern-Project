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
var crypto = require('crypto');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/wendor');
var db = mongoose.connection;

//Init gfs
db.once('open',() =>{
  //Init stream
  var gfs = Grid(db, mongoose.mongo);
  gfs.collection('uploads');
})

//Create storage engine
var storage = new GridFsStorage({
  url: 'mongodb://localhost/wendor',
  file: (req,file) => {
    return new Promise((resolve,reject)=>{
      crypto.randomBytes(16, (err, buf)=>{
        if (err){
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({storage});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//For cookies
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave:true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());


app.use('/admin',adminRouter);
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
