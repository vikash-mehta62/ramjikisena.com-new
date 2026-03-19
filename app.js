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
const swaggerUi = require('swagger-ui-express');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var kathaVachakRouter = require('./routes/kathaVachak');
var panditRouter = require('./routes/pandit');
var bookingRouter = require('./routes/booking');
var panditDashboardRouter = require('./routes/panditDashboard');
var panditAuthRouter = require('./routes/panditAuth');
var samagriRouter = require('./routes/samagri');
var communityRouter = require('./routes/community');
var forumRouter = require('./routes/forum');

var app = express();

// Create uploads/temp directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads', 'temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({
  origin: ['https://ramjikisena.com', 'http://localhost:3000', 'http://localhost:3001', 'https://ramjikisena-com-new.vercel.app'],
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
  secret: process.env.EXPRESS_SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Cross-domain in production
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log(`Current environment ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV !== 'production') {
  const swaggerOutput = require('./swagger-output.json');

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,   // keeps JWT across page refreshes
        displayRequestDuration: true, // shows response time in UI
        filter: true,                 // enables tag/endpoint search bar
        tryItOutEnabled: true,        // "Try it out" open by default
      },
      customSiteTitle: 'Ram Ji Ki Sena Docs',
    })
  );
  console.log(`Swagger UI  → http://localhost:${process.env.PORT || 3000}/api-docs`);
}

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
app.use('/api/katha-vachaks', kathaVachakRouter);
app.use('/api/pandits', panditRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/pandit-dashboard', panditDashboardRouter);
app.use('/api/pandit-auth', panditAuthRouter);
app.use('/api/samagri', samagriRouter);
app.use('/api/community', communityRouter);
app.use('/api/forum', forumRouter);

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
