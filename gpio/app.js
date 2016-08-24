/**
 *  Module dependencies.
 */

var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var env = require('node-env-file');

var app = express();



// Configuration
require('./system/prototype');
global.config = require('./system/config');

// i18n
global.i18n = require('./system/i18n');
global.i18n.setLanguage('pt');

// Database
var sqliteInit = require('./system/db/sqliteInit');
sqliteInit.dbCreate();

if (global.config.site.database === 'mysql') {
  var mysqlInit = require('./system/db/mysqlInit');
  mysqlInit.dbCreate();
}

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

env(__dirname + '/.env', {overwrite: true});

// Routing
// Home Page
var routes = require('./routes/index');
app.use('/setLanguage', routes);
app.use('/', routes);

// Sensors
var sensorTypeRoute = require('./routes/sensorTypeRouteConfig');
new sensorTypeRoute(app);

var sensorRoute = require('./routes/sensorRouteConfig');
new sensorRoute(app);

// Pin - GPIO
var pinRoute = require('./routes/pinRouteConfig');
new pinRoute(app);

// Action - alarm setup
var actionRoute = require('./routes/actionRouteConfig');
new actionRoute(app);

// Events
var eventRoute = require('./routes/eventRouteConfig');
new eventRoute(app);

// Login
var loginRoute = require('./routes/loginRouteConfig');
new loginRoute(app);

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
