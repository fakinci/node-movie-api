const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies');
const directorsRouter = require('./routes/directors');

const app = express();

//db connect
const db = require("./helper/db.js")();

//config
const config = require("./config");   // api_secret_key için
app.set("api_secret_key",config.api_secret_key);  // global olarak kullanmak için ,(kullanırken get ile kullanacağız

//middleware

const verifyToken = require("./middleware/verify-token");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // default olarak false geliyor biz true yapıyoruz
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); //boş kukkanılıyor /index yazmıyoruz
app.use("/api",verifyToken);//bu sıra önemli bu satırı sona koyarsan movies ve directors te işeyaramaz
app.use('/api/movies', moviesRouter);
app.use('/api/directors', directorsRouter);


// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error'); bunun yerine
  res.json({error:{message:err.message, code: err.code}})
});

module.exports = app;
