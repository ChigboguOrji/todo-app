var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var todosRouter = require('./routes/todos');
var completedRouter = require('./routes/completed');

var app = express();
var myDb = 'mongodb://127.0.0.1:27017/todos';
mongoose.connect(myDb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  keepAlive: true,
  keepAliveInitialDelay: 30000
});
mongoose.connection.on('error', function () {
  console.error('Database connection failed');
})
mongoose.connection.once('open', function () {
  console.info('Database connected');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: 'session',
  resave: true,
  saveUninitialized: true
}))
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.appname = 'Todo';
app.locals.author = 'Chigbogu';
var enteries = [];
app.locals.enteries = enteries;

app.use('/', indexRouter);
app.use('/todos/', todosRouter);
app.use('/completed/', completedRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;