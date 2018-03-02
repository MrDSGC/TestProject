var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');

var User = require('../models/User');
var SignUpInviteCode = require('../models/SignUpInviteCode');
var Project = require('../models/Project');
var UrlRedirect = require('../models/UrlRedirect');

/**
 * Ensure Admin
 */
exports.ensureAdmin = function(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

function generateToken(user) {
  var payload = {
    iss: 'www.thehackhive.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

//app.post('/api/admin/loginAs
exports.loginAsUserPost = function(req, res) {
  User.findOne({ _id: req.body.userParamToMatch })
  .exec( (err, user) => {
    if (!user) {
      return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
      'Double-check your email address and try again.'
      });
    } else {
      res.send({ token: generateToken(user), user: user.toJSON() });
    }
  });
};

/******* Get All Users *******/
//app.get('/api/admin/allUsers'
exports.getAllUsersAdminGet = function(req, res) {
  User.find()
  .exec( (err, users) => {
    if (!users) {
      return res.status(401).send({ msg: 'Some eror'});
    } else {
      res.send(users);
    }
  });
};


/******* Handle Login As Requests *******/
//app.post('/api/admin/loginAs
exports.loginAsUserPost = function(req, res) {
  User.findOne({ _id: req.body.userParamToMatch })
  .exec( (err, user) => {
    if (!user) {
      return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
      'Double-check your email address and try again.'
      });
    } else {
      res.send({ token: generateToken(user), user: user.toJSON() });
    }
  });
};


/******* Get All Invite Codes *******/
//app.get('/api/admin/signUpInvites
exports.signUpInvitesGet = function(req, res) {
  SignUpInviteCode.find()
  .populate('usersWithSignUpInviteCode')
  .exec( (err, signUpInviteCodes) => {
    if (!err && signUpInviteCodes) {
      res.send(signUpInviteCodes);
    } else {
      res.status(404).send({ msg: "codes not found" });
    }
  });
};

/******* Create an invite code or update it *******/
//app.post('/api/admin/signUpInvites
exports.signUpInvitesPost = function(req, res) {
  var signUpInviteCodeToSubmit = req.body.signUpInviteCodeToSubmit;

  SignUpInviteCode.findByIdAndUpdate(signUpInviteCodeToSubmit.id, signUpInviteCodeToSubmit)
  .exec( (err, signUpInviteCodes) => {
    if (!err && !signUpInviteCodes) {
      // SignUpInviteCode was not found, and therefore not updated. create a SignUpInviteCode
      var createdSignUpInviteCode = new SignUpInviteCode(signUpInviteCodeToSubmit);
      createdSignUpInviteCode.save( (err)=> {
        res.send({
          signUpInviteCode: createdSignUpInviteCode,
          state: "newSignUpInviteCode"
        });
      });
    } else if (!err && signUpInviteCodes) {
      // Tag found and updated
      res.send({
        signUpInviteCodes,
        state: "updated"
      });
    } else {
      // error
      res.status(404).send({msg: "Error"});
    }
  });
};

/******* project view for admins *******/
//app.get('/api/admin/project/:projectSlug

exports.projectGet = function(req, res) {

  Project.findOne({slug: req.params.projectSlug})
  .populate({
    path: "votes",
    populate: {path: "user"}
  })
  .populate("userProjectAssoc")
  .populate(Project.getTagsAndCreators())
  .exec( (err, projectObject) => {
    if (!err && projectObject) {
      res.send(projectObject.projectWithBuildersJSON());
    } else {
      res.status(404).send({msg: 'Sorry not found'});
    }
  })
};

/******* user admin view view for admins *******/
//app.get('/api/admin/user/:userSlug
exports.adminUserGet = function(req, res) {
  User.findOne({slug: req.params.userSlug})
  .populate(User.projectsFromUserPopulate())
  .populate('userFollowers')    // user who follow the current user.
  .populate('userFollowing')    // user the current user follows
  .populate('knowsTags')
  .populate({
    path: 'votes',
    populate: {
      path: 'project',
      populate: {path: 'techTags'}
    }
  })
  .exec( (err, userObject) =>  {
    if (!err && userObject) {
      // create return object.
      var userReturnObject = userObject.toJSON();
      userReturnObject.votes = userObject.votes;
      userReturnObject.projects = userObject.projects();
      userReturnObject.userFollowers = userObject.userFollowers;
      userReturnObject.userFollowing = userObject.userFollowing;

      res.send({user: userReturnObject});
    } else {
      res.status(404).send({msg: 'Sorry not found'});
    }
  })
};

/******* setup a URL redirect for the site *******/

//app.get('/api/siteManagement/urlRedirect/:redirectSlug
exports.siteURLRedirectGet = function(req, res) {

  UrlRedirect.findOne({redirectSlug: req.params.redirectSlug})
  .exec( (err, urlRedirectObject) => {

    var resSendObject = (urlRedirectObject) => {
      var redirectToSend = {
        urlToGoTo: urlRedirectObject.toUrl,
        isValidUrlRedirect: true
      }
      res.send(redirectToSend);
    }

    if (!err && urlRedirectObject) {
      // setup null counter
      if (!urlRedirectObject.urlRedictCount) {
        urlRedirectObject.urlRedictCount = 1;
        urlRedirectObject.urlRedirectEvents = [{
          user: req.user ? req.user : null,
          redirectTime: Date.now()
        }]

        urlRedirectObject.save( (err)=> {
          resSendObject(urlRedirectObject);
        });

      } else {
        // increment counter
        urlRedirectObject.urlRedictCount++;
        urlRedirectObject.urlRedirectEvents.push({
          user: req.user ? req.user : null,
          redirectTime: Date.now()
        });

        urlRedirectObject.save( (err)=> {
          resSendObject(urlRedirectObject);
        });

      }
    } else {
      var redirectToSend = {
        isValidUrlRedirect: false
      }
      res.send(redirectToSend);
    }
  });
};

/******* Get all Site URL Redirecs *******/
// Admin only
//app.get('/api/siteManagement/urlRedirect/allUrlRedirects
exports.allSiteURLRedirectsGet = function(req, res) {
  UrlRedirect.find()
  .exec( (err, urlRedirectObjects) => {
    if (!err && urlRedirectObjects) {
      res.send({siteURLObjects: urlRedirectObjects});
    } else {
      res.status(404).send({msg: "Error"});
    }
  });
};

//******* To Do *** add ability to add site redirect URLs
/******* Get all Site URL Redirecs *******/
// Admin only
//app.get('/api/siteManagement/urlRedirect/allUrlRedirects
//app.post('/api/siteManagement/urlRedirect/addNewRedirect
exports.siteURLRedirectPost = function(req, res) {

  res.send('http://www.varunbhartia.com')

};
