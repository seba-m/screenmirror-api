var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '1kb' }));
app.use(express.urlencoded({ limit: '1kb', extended: true }));
app.use(cookieParser());

require('./src/routes/user.routes')(app);
require('./src/routes/auth.routes')(app);
require('./src/routes/stream.routes')(app);

app.get('/', (req, res, next) => {
    res.redirect(process.env.clientUrl);
});

app.use(function (err, req, res, next) {
    res.redirect(process.env.clientUrl);
});

app.use(function (req, res, next) {
    var err = null;
    try {
        decodeURIComponent(req.path)
    }
    catch (e) {
        err = e;
    }
    if (err) {
        console.log(err.message, req.url);
        return res.redirect(process.env.clientUrl);
    }
    next();
});
/*
var createError = require('http-errors');

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message)

  res.status(err.status || 500);
  res.json(`error '${err.status || 500}' `);
});*/

module.exports = app;
