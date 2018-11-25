var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('config');

var indexRouter = require('./routes/index');
var inventoryRouter = require('./routes/inventory');

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);

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
  res.render('error');
});

module.exports = app;
