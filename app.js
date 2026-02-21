require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');

var app = express();

// Create uploads/temp directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads', 'temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({
  origin: ['https://ramjikisena.com', 'http://localhost:3000', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.EXPRESS_SESSION_SECRET
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'uploads', 'temp'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true,
  createParentPath: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/upload', uploadRouter);

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
