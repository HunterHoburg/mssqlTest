var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sql = require('mssql');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var dbConfig = {
  user: 'nextgen',
  password: 'nextgen',
  server: 'mssql://e3sst003.allstate.com',
  port: 1433,
  database: 'E3D_ESMDB',
  options: {
    encrypt: true
  }
}
sql.connect('mssql://nextgen:nextgen@e3sst003.allstate.com:1433/E3D_ESMDB').then(function() {
  console.log('success');
  new sql.Request().query("select * from EC_Contact_Table where CT_User_ID = 'rdumiak'").then(function(recordset) {
    console.dir(recordset);
  }).catch(function(err) {
    console.log(err);
  });
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
