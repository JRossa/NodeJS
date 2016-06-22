/**
 *  Module dependencies.
 */


var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();



// Configuration
require('./system/prototype');
global.config = require('./system/config');

// i18n
global.i18n = require('./system/i18n');
global.i18n.setLanguage('pt');

// Database
var dbInit = require('./system/db/dbInit');
dbInit.dbCreate();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', global.config.site.html.engine);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Angular
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));


// Routing
// Home Page
var routes = require('./routes/index');
app.use('/', routes);

// Sensors
var sensorTypeRoute = require('./routes/sensorTypeRouteConfig');
new sensorTypeRoute(app);

var sensorRoute = require('./routes/sensorRouteConfig');
new sensorRoute(app);

// GPIO

// Events
var eventRoute = require('./routes/eventRouteConfig');
new eventRoute(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
