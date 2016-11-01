var express = require('express');
var app = express();
var path = require('path');
var session = require('client-sessions');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var home = require('./routes/homepage');
var login = require('./routes/login');
var success = require('./routes/profile');
var homePageAfterLogin = require('./routes/loggedin');
var tweet = require('./routes/tweet');
//var otherProfile = require('./routes/otherProfile');
var hashPage = require('./routes/hashtagsearch');
var routes = require('./routes/index');
var users = require('./routes/users');
var signUp = require('./routes/signup');
var handleSearchPage = require('./routes/usernamesearch');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port',3000);
app.use(session({

  cookieName: 'session',
  secret: 'cmpe273_test_string',
  duration: 30 * 60 * 1000,    //setting the time for active session
  activeDuration: 5 * 60 * 1000,  }));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/',home.goToHomePage);
app.get('/signUp',signUp.goToSignUpPage);
app.post('/afterSignIn',login.afterSignIn);
app.post('/afterSignUp',signUp.afterSignUp);
app.get('/loggedin',homePageAfterLogin.goToHomePageAfterLogin);
app.post('/logout',login.logout);
app.get('/profile',success.goToSuccessPage);
app.post('/insertTweet',tweet.insertTweet);
app.get('/fetchTweets',tweet.fetchTweets);
app.get('/fetchUserInfo',tweet.fetchUserInfo);
app.post('/setHash',tweet.setHash);
app.get('/gethashsearchpage',hashPage.goToHashPage);
app.get('/fetchHashes',tweet.fetchHashes);
app.get('/getMyInfo',tweet.getMyInfo);
app.get('/fetchUsersToFollow',tweet.fetchUsersToFollow);
//app.get('/goToOtherProfile',otherProfile.goToOtherProfile);
app.get('/getOtherUserComments',tweet.getOtherUserComments);
app.post('/setUserForOtherProfile',tweet.setUserForOtherProfile);
app.get('/getusernamesearch',handleSearchPage.goToHandleSearchPage);
app.post('/performFollow',tweet.performFollow);
app.post('/performRetweet',tweet.performRetweet);
app.post('/getList',success.getList);
/*app.use('/', routes);
app.use('/users', users);*/

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


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

http.createServer(app).listen(app.get('port'),function(){
  console.log("Server created and listening successfully on Port :"+app.get('port'));
})
module.exports = app;
