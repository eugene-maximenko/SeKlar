var express = require('express');
var path = require('path');
var createError = require('http-errors');
const {engine} = require('express-handlebars');

var indexRouter = require('./routes/index');
var gamesRouter = require('./routes/games');

var app = express();

// view engine setup
app.engine('handlebars', engine({
  extname: "hbs",
  defaultLayout: false,
  layoutsDir: "views/layouts/"
}));
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/games', gamesRouter);

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
