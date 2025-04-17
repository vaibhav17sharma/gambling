require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authenticateMiddleware = require('./middlewares/authentication');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/authentication');
const couponRouter = require('./routes/coupon');


const app = express();

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', authenticateMiddleware, usersRouter);
app.use('/api/coupon', authenticateMiddleware, couponRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  if (req.originalUrl.startsWith('/api')) {
    return res.json({
      error: {
        message: err.message,
        status: err.status || 500,
      },
    });
  }

  res.render('error', {
    title: 'Error',
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
