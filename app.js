// dependencies ================================================================
var express = require('express');
var expressValidator = require('express-validator');
var session = require('express-session');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var path = require('path');
var flash = require('connect-flash');

var mongo = require('mongodb');
var mongoose = require('mongoose');
var config = require('./config/database')

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// DB configuration ============================================================

//set connection to db
mongoose.connect(config.databaseURL);

//db connection test
mongoose.connection.on('connected', () => {
  console.log("Mongo says: Hello (^_^)")
});

//db error test
mongoose.connection.on('error', (err) => {
  console.log("Mongo says: Bloody Hell (-_-) \n" + err)
});

// Express =====================================================================
//init app
var app = express();

// Middleware ==================================================================
// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator
// Copied from express-validator documentation https://github.com/ctavan/express-validator
// {
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
// }

// Passport init 
app.use(session({ secret: 'Supercalifragilisticexpialidocious', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//define routes ================================================================
var routes = require('./routes/homepage');
var users = require('./routes/users');

//setting routes ===============================================================
app.use('/', routes);
app.use('/users', users);

//start server =================================================================
app.listen(3000, function () {
  console.log('Node says: I\'m online @ 3000 (^_^)')
})