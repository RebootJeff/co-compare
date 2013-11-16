/*jslint node: true */
'use strict';

var express = require('express'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  homeRoute = require('./routes/index'),
  retrieveRoute = require('./routes/retrieve'),
  submitRoute = require('./routes/submit'),
  voteRoute = require('./routes/vote'),
  config,
  app = express();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Configuration
if(process.env.NODE_ENV === 'production'){
  config = require('./config_production');
} else {
  config = require('./config_dev');
}

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: config.fb.SECRET }));
app.use(express.logger('dev'));
app.use(passport.initialize());
app.use(passport.session());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Set and start using models
app.set('models', require('./models'));
var models = app.get('models');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Facebook authentication strategy
passport.use(new FacebookStrategy({
  clientID: config.fb.APP_KEY,
  clientSecret: config.fb.SECRET,
  callbackURL: 'http://' + config.host + ':' + config.port + '/api/auth/facebook/callback'
},
  function(accessToken, refreshToken, profile, done) {
      console.log('about to query database hereeeeee -------------------- !');
    models.User.findOrCreate({fbId: profile.id, name: profile.displayName})
    .success(function(user){
      console.log('done hereeeeee -------------------- !');
      done(null, user);
    })
    .error(function(err){
      console.log('Could not find/create user.', err);
    });
  })
);

// Establish session via cookie
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  // NOTE: expand this function if multiple authentication strategies are used
  done(null, user);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Routing for authentication
var checkAuth = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    res.send(401);
  }
};
app.get('/api/loggedin', function(req, res){
  if(req.isAuthenticated()){
    res.send(200, req.user);
  } else {
    res.send(200, 'no user');
  }
});
app.get('/api/logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

var whoa = function(){ console.log('\n ~~~ whoa ~~~ \n'); };
// Passport will perform FB login when client makes the following GET request
app.get('/api/auth/facebook', passport.authenticate('facebook'));
// Facebook will make the following GET request after user logs in
app.get('/api/auth/facebook/callback', whoa(), passport.authenticate('facebook', {
  // TODO: Redirect user to whatever URL they were at before logging in
  successRedirect: '/',
  failureRedirect: '/'
}));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Routing API calls
// TODO: Make this more CRUDy? (e.g., change `retrieve` to `read`)
app.get('/api/home', homeRoute.browse);
app.get('/api/view/:hash', retrieveRoute.retrieve);
app.post('/api/submit', checkAuth, submitRoute.submit);
app.post('/api/vote', checkAuth, voteRoute.submit);
// catch-all route:
app.use(function (req, res) {
  res.json({'ok': false, 'status': '404'});
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// And now we wait...
app.listen(config.port);
console.log('Listening on port ' + config.port);
