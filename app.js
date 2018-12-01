var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('config');

var indexRouter = require('./routes/index');
var inventoryRouter = require('./routes/inventory');

const authRoutes = require('./routes/auth-routes'); 
const profileRoutes = require('./routes/profile-routes'); 
const passportSetup = require('./config/passport-setup'); 
const keys = require('./config/keys'); 
const cookieSession = require('cookie-session'); 
const passport = require('passport'); 

var app = express();

// Get MongoDB connection string from config/default.json file
const dbConnectionString = config.get('database.connectionstring');

// Setup MongoDB connection
mongoose.Promise = global.Promise;
mongoose.connect(dbConnectionString, { useNewUrlParser: true })
  .then(() => { console.log('Connected to MongDB.')})
  .catch((reason) => { console.log('MongoDB connection error:', reason)});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);



app.use('/inventory', inventoryRouter);
app.use('/auth', authRoutes); 
app.use('/profile', profileRoutes); 

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, 
  keys: [keys.session.cookieKey]
})); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
