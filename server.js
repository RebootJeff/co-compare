/*jslint node: true */
'use strict';

var express = require('express'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  homeRoute = require('./routes/index'),
  retrieveRoute = require('./routes/retrieve'),
  submitRoute = require('./routes/submit'),
  voteRoute = require('./routes/vote'),
  deleteRoute = require('./routes/delete'),
  config,
  app = express();

// __________________________________________________________________
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

// __________________________________________________________________
// Set and start using models
app.set('models', require('./models'));
var models = app.get('models');

// __________________________________________________________________
// Facebook authentication strategy

passport.use(new FacebookStrategy({
  clientID: config.fb.APP_KEY,
  clientSecret: config.fb.SECRET,
  callbackURL: config.fb.callbackURL
},
  function(accessToken, refreshToken, profile, done) {
    models.User.findOrCreate({fbId: profile.id, name: profile.displayName})
    .success(function(user){
      done(null, user);
    })
    .error(function(err){
      console.log('Could not find/create user:', err);
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

// __________________________________________________________________
// Routing for authentication
var checkAuth = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    res.send(401);
  }
};
app.get('/api/loggedin', function(req, res){
  res.status(200);
  if(req.isAuthenticated()){
    res.send(req.user);
  } else {
    res.send('no user');
  }
});
app.get('/api/logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

// Passport will perform FB login when client makes the following GET request
app.get('/api/auth/facebook', passport.authenticate('facebook'));
// Facebook will make the following GET request after user logs in
app.get('/api/auth/facebook/callback', passport.authenticate('facebook', {
  // TODO: Redirect user to whatever URL they were at before logging in
  successRedirect: '/',
  failureRedirect: '/'
}));

// __________________________________________________________________
// Routing API calls
app.get('/api/home', homeRoute.browse);
app.get('/api/comparison/:hash/user/:userId', retrieveRoute.retrieve);
app.post('/api/comparison', checkAuth, submitRoute.submit);
app.delete('/api/comparison/:hash/user/:userId', checkAuth, deleteRoute.removeComparison);
app.post('/api/vote', checkAuth, voteRoute.submit);
// TODO: Add 404 error page rather than just responding with text
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('404 error: Not found');
});
// TODO: Add more CRUD
// e.g., app.put('/api/edit/:hash', checkAuth, editComparison);

// __________________________________________________________________
// And now we wait...
app.listen(config.port);
console.log('Listening on port ' + config.port + ' ...');
