var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var Provider = require('react-redux').Provider;
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var sass = require('node-sass-middleware');
var webpack = require('webpack');
var config = require('./webpack.config');
const passport = require('passport');

// Load environment variables from .env file
dotenv.load();

// ES6 Transpiler
require('babel-core/register');
require('babel-polyfill');

// Models
var User = require('./models/User');
var Project = require('./models/Project'); // used for project tags

// Controllers
var userController = require('./controllers/user');
var projectController = require('./controllers/projectController');
var profileController = require('./controllers/profileController');
var tagController = require('./controllers/tagController');
var adminController = require('./controllers/adminController');
var inviteRequestController = require('./controllers/inviteRequestController');
var analyticsController = require('./controllers/analyticsController');
var voteController = require('./controllers/voteController');
var eventObjectAndSubscribeController = require('./controllers/eventObjectAndSubscribeController')
var userFollowController = require('./controllers/userFollowController');
var sloHacksController = require('./controllers/sloHacksController');
var searchController = require('./controllers/searchController');

// Metatag Generator
var metaTagGenerator = require('./utils/metaTagGenerator');

// React and Server-Side Rendering
var routes = require('./app/routes');
var configureStore = require('./app/store/configureStore').default;

var app = express();
var compiler = webpack(config);

mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

if (app.get('env') === 'production') {
  process.env.serverEnv = "production"
} else {
  process.env.serverEnv = "development"
}

require('./config/passport');

var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(sass({ src: path.join(__dirname, 'public'), dest: path.join(__dirname, 'public') }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use(function(req, res, next) {
  req.isAuthenticated = function() {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;

    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    User.findById(payload.sub)
    .populate("knowsTags")
    .exec( (err, user) => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

if (app.get('env') === 'development') {
  process.env.serverEnv = "development"

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  //app.use(require('webpack-hot-middleware')(compiler));
} else {
  // production redirect to https, ignore on local host
  app.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}


/********* ROUTES **********/
//app.get('/util/tagPopulateGet', utilsController.tagPopulateGet);

/*******************
Request Invite API Handler
***************/
//app.post('/api/inviteRequest', inviteRequestController.inviteRequestPost);


/*******************
Master Search
***************/
app.get('/api/search/:searchString', searchController.searchGet);

/*******************
Profile API Handler
***************/
app.get('/api/profile/:slug', profileController.profileGet);
//app.get('/api/tags', tagController.tagsGet);

/*******************
Projects API Handler
***************/
// search all projects
app.get('/api/projects', projectController.projectsAllGet);

// get all projects
app.get('/api/projects/search/:searchString', adminController.ensureAdmin, projectController.projectsSearch);
// get a particular project with a slug, returns only public projects
app.get('/api/project/:slug', projectController.projectGet);
// get project if it belongs to a user, returns all project - regardless of public setting. Get all projects
app.get('/api/currentUser/project/:projectSlug', userController.ensureAuthenticated, projectController.currentUserProjectGet);
//Update or create project
app.put('/api/currentUser/project', userController.ensureAuthenticated, projectController.currentUserProjectPut);

//user project managemnt get projects from current user
app.get('/api/user/projects/', userController.ensureAuthenticated, projectController.userProjectsGet);

//Send and deleteUserInvite
app.post('/api/currentUser/project/colabInvite/:projectId', projectController.colabInvitePost);
app.delete('/api/project/colabInvite/:inviteId', projectController.colabInviteDel);
app.post('/api/currentUser/project/invite/inviteCode', projectController.addInviteCodeToProjectPost);
app.delete('/api/project/removeUserProjectAssoc', userController.ensureAuthenticated, projectController.removeProjectCollaboratorAssocDel);

//Update Project Order for User Profile
app.post('/api/currentUser/updateProjectOrder', userController.ensureAuthenticated, projectController.updateProjectOrderPost);

//Update User Order on project
app.post('/api/project/updateUserOnProjectOrder', userController.ensureAuthenticated, projectController.updateUserOnProjectOrderPost);

//Delete a project
app.delete('/api/currentUser/project/:projectId', userController.ensureAuthenticated, projectController.currentUserProjectDelete);

/*******************
Tags Routes
***************/
// returns tags from a search string
app.get('/api/tags/search/:tagFriendlyNameSearchString', tagController.tagsSearchGet);

// get all tags
app.get('/api/tags', tagController.tagsGet);

/*******************
User Routes
***************/
app.post('/login', userController.loginPost);
app.post('/signup', userController.signupPost);
app.put('/account', userController.accountPut);
app.post('/api/addInviteCode', userController.ensureAuthenticated, userController.addInviteCodePost);

// request an invite
app.post('/api/inviteRequest', voteController.projectVotePost);

/*******************
Follow Routes
***************/

// Get Followers from a user
app.get('/api/userFollow/getUserFollowers/:userToGetFollowersId', /*userController.ensureAuthenticated,*/ userFollowController.getUserFollowers);

// Get Who the user follows
app.get('/api/userFollow/getUserFollowing/:userToGetFollowingId', /*userController.ensureAuthenticated,*/ userFollowController.getUserFollowing);


// Have the current user follow someone.
app.post('/api/userFollow/addFollowFromCurrentUserToAnotherUser', /*userController.ensureAuthenticated,*/ userFollowController.addFollowFromCurrentUserToAnotherUserPost);


/*******************
Analytics Routes
***************/
app.get('/api/analytics/:objectType/:objectId', adminController.ensureAdmin, analyticsController.objectImpressionEventsGet);

/*******************
Vote Routes
***************/
// Vote on project
app.post('/api/vote/projectVote', voteController.projectVotePost);
app.get('/api/vote/confirmEmailToken/:verifyEmailToken', voteController.confirmEmailTokenGet);

/*******************
Subscribe and Event Routes
***************/
// Subscribe to an event
app.post('/api/eventObject/addSubscribe', eventObjectAndSubscribeController.eventObjectSubscribePost);
app.get('/api/eventObject/:eventObjectId', eventObjectAndSubscribeController.eventObjectGet);

/*******************
Site Management Routes
***************/
app.get('/api/siteManagement/urlRedirect/allUrlRedirects', adminController.ensureAdmin, adminController.allSiteURLRedirectsGet);
app.get('/api/siteManagement/urlRedirect/:redirectSlug', adminController.siteURLRedirectGet);
app.post('/api/siteManagement/urlRedirect/addNewRedirect', adminController.ensureAdmin, adminController.siteURLRedirectPost);


/*******************
Slo Hacks Routes
***************/
// Get Slo Projects
app.get('/api/slohacks/projects', sloHacksController.projectsGetSloHacksGet);

/*******************
Admin Routes
***************/
// user
app.post('/api/admin/loginAs', adminController.ensureAdmin, adminController.loginAsUserPost);
app.get('/api/admin/allUsers', adminController.ensureAdmin, adminController.getAllUsersAdminGet);
app.get('/api/admin/user/:userSlug', adminController.ensureAdmin, adminController.adminUserGet);

// project
app.get('/api/admin/projects', adminController.ensureAdmin, projectController.projectsAllGet);
app.get('/api/admin/project/:projectSlug', adminController.ensureAdmin, adminController.projectGet);
app.delete('/api/admin/project/:projectId', /*adminController.ensureAdmin,*/ projectController.currentUserProjectDelete);

// create or update an admin tag
app.post('/api/admin/tag', adminController.ensureAdmin, tagController.tagPost);
app.get('/api/admin/tags/:tagSlug', adminController.ensureAdmin, tagController.getTagProjectsPeople);

// create or update an admin SignUpInviteCode
app.post('/api/admin/signUpInviteCode', adminController.ensureAdmin, adminController.signUpInvitesPost);
app.get('/api/admin/signUpInviteCodes', adminController.ensureAdmin, adminController.signUpInvitesGet);

//get all invite requests
app.get('/api/admin/inviteRequests', adminController.ensureAdmin, inviteRequestController.inviteRequestsGet);

// Get all vote objects for a project
app.get('/api/vote/projectVote/:projectId', adminController.ensureAdmin, voteController.projectVoteGet);

//Facebook Login
//JWT token generator
var jwt = require('jsonwebtoken');
function generateToken(user) {
  var payload = {
    iss: 'www.thehackhive.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

app.get(
  '/auth/facebook',
  passport.authenticate('facebook',
  { session:false, scope: ['email'] })
);

app.get(
  '/facebook/callback',
  passport.authenticate('facebook', {session:false}),
  function(req, res) {
    var response = { token: generateToken(req.user), user: req.user }
    res.redirect('/facebookRedirect/?token='+ response.token);
  }
);

// return current user object with token
app.post('/api/currentUser', (req, res) => {
  var user;
  var nextStepURL = "/"
  if (req.user) {
    user = req.user;

    // Check if they have an invite code associated.
    if (req.user.signUpInviteObject) {
      // have an invite code !

      // Send them to their profile to complete
      if (user.initialProfileComplete) {
        // They completed their profile, go to their projects home.
        nextStepURL = "/projects"

      } else {
        // user didn't complete their profile, send them to their profile to complete
        nextStepURL = "/completeProfile"
      }

    } else {
      // don't have an invite code! Go to screen to add invite code.
      nextStepURL = "/addInviteCode"
    }

    var response = { token: generateToken(req.user), user: req.user, nextStepURL }
    res.send(response);

  } else {
    // not req.user
    res.status(404).send({msg: "There was a problem :("});
  }
})

// React server rendering
app.use(function(req, res) {
  var initialState = {
    auth: { token: req.cookies.token, user: req.user },
    messages: {}
  };

  var store = configureStore(initialState);
  Router.match({ routes: routes.default(store), location: req.url }, function(err, redirectLocation, renderProps) {

    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {

      var html = ReactDOM.renderToString(React.createElement(Provider, { store: store },
        React.createElement(Router.RouterContext, renderProps)
      ));

      metaTagGenerator.returnMetaTagsFromObjects(req.url, (metaTags) => {

        if (!metaTags) {
          metaTags = {};
        }
        metaTags.type = "website";

        //setup default metatags
        if (metaTags.status == "error") {
          metaTags.title = "HackHive - Home of awesome projects";
          metaTags.image = "http://" + req.headers.host + "/assets/img/HackHiveAssets/hackHiveLogo.png";
          metaTags.description = "HackHive is an exclusive site for developers to show off their projects, connect with other developers and get hired!";
        }

        res.render('layouts/main', {
          metaTags,
          html: html,
          currentUser: req.user,
          initialState: store.getState()
        });
      })    // find metatags function

    } else {
      res.sendStatus(404);
    }
  });
});

// Production error handler
if (app.get('env') === 'production') {
  process.env.serverEnv = "production"
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
