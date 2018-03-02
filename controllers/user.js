var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');

var User = require('../models/User');
var SignUpInviteCode = require('../models/SignUpInviteCode');

var emailManager = require('../utils/emailManager');

function generateToken(user) {
  var payload = {
    iss: 'www.thehackhive.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

  /**
   * POST /login
   * Sign in with email and password
   */
  exports.loginPost = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }

    User.findOne({ email: req.body.email })
    .populate('knowsTags')
    .exec( (err, user) => {
      if (!user) {
        return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
        'Double-check your email address and try again.'
        });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ msg: 'Invalid email or password' });
        }
        res.send({ token: generateToken(user), user: user });
      });
    });
  };

/**
 * POST /signup
 */

 // Used for email sign up path.
exports.signupPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
    }

    /*
    SignUpInviteCode.findOne({inviteCode: req.body.inviteCode})
    .exec( (err, signUpInviteCode)=> {
      if (!err && signUpInviteCode) {
      */
        // Invite Code Found! Check if it's good and associate with user.
        //if (signUpInviteCode.checkSignupInviteCodeStatusAndUpdate()) {
          //Associate with a new user
          user = new User({
            email: req.body.email,
            password: req.body.password,
            initialProfileComplete: false,
            initialProjectComplete: false,
            slugUpdateRequired: true,
            slug: Date.now().toString(),
            //signUpInviteObject: signUpInviteCode,
            //firstName: signUpInviteCode.helperFirstName,
            //lastName: signUpInviteCode.helperLastName,
            //profilePicUrl: signUpInviteCode.helperProfilePic
          });

          user.save(function(err) {
            var emailSubject = "New User Signed Up: " + user.firstName + " " + user.lastName + " " + user.email;
            var profileUrl = "https://www.thehackhive.com/profile/" + user.slug;

            emailManager.sendInternalAlert(emailSubject, profileUrl + " " + JSON.stringify(user, null, 2), emailManager.emailInternalAlertEvents().NEW_USER_SIGN_UP)
            req.user = user;

            res.send({user: user, token: generateToken(user)});
          });

        /*} else {
          return res.status(404).send({ msg: 'The invite code wasn\'t found, or is invalid 😿. Request One!' });
        }

      } else {
        // Invite code not found. Send Error
        return res.status(404).send({ msg: 'The invite code wasn\'t found, or is invalid 😿. Request One!' });
      }
      */
//    });

  });
};

/**
 * Post /api/addInviteCode
 * Add an invite code to a user
 */

exports.addInviteCodePost = function(req, res, next) {
  SignUpInviteCode.findOne({inviteCode: req.body.inviteCode})
  .exec( (err, signUpInviteCode)=> {
    if (!err && signUpInviteCode) {

      // Invite Code Found! Check if it's good and associate with user.
      if (signUpInviteCode.checkSignupInviteCodeStatusAndUpdate()) {
        // Invite Code is good.
        //Associate with a new user
        User.findById(req.user.id)
        .exec( (err, user) =>  {
          if(!err && user) {

            // User found. save and connect
            user.signUpInviteObject = signUpInviteCode;
            user.save(function(err) {
              var emailSubject = "Added an invite code to a user " + user.firstName + " " + user.lastName + " " + user.email;
              var profileUrl = "https://www.thehackhive.com/profile/" + user.slug;

              emailManager.sendInternalAlert(emailSubject, profileUrl + " " + JSON.stringify(user, null, 2), emailManager.emailInternalAlertEvents().SIGN_UP_INVITE_CODE_CLAIMED);
              req.user = user;
              res.send({user: user, token: generateToken(user)});
            });
          } else {
            // user wasn't found for some reason
            return res.status(404).send({ msg: 'The invite code wasn\'t found, or is invalid 😿. Request One!' });
          }
        });

      } else {
        // Invite code is invalid. Send error
        return res.status(404).send({ msg: 'The invite code wasn\'t found, or is invalid 😿. Request One!' });
      }

    } else {
      // Invite code not wasn't found at all. Send Error
      return res.status(404).send({ msg: 'The invite code wasn\'t found, or is invalid 😿. Request One!' });
    }
  });
}

/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = function(req, res, next) {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  User.findById(req.body._id, function(err, user) {
    user.slug = req.body.slug;
    user.slugUpdateRequired = false;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.profilePicUrl = req.body.profilePicUrl;
    user.links = req.body.links;
    user.initialProfileComplete = true;
    user.knowsTags = req.body.knowsTags;

    user.save(function(err) {
      if (req.body.sendWelcomeEmail) {
        emailManager.sendWelcomeEmail(user, req, res)
      }

      if ('password' in req.body) {
        res.send({ msg: 'Your password has been changed.' });
      } else if (err && err.code === 11000) {
        res.status(409).send({ msg: 'The email address you have entered is already associated with another account.' });
      } else {
        var emailSubject = "Profile Updated: " + user.firstName + " " + user.lastName + " " + user.email;
        var profileUrl = "https://www.thehackhive.com/profile/" + user.slug;

        emailManager.sendInternalAlert(emailSubject, profileUrl + " " + JSON.stringify(user, null, 2), emailManager.emailInternalAlertEvents().PROFILE_UPDATE)
        res.send({ token: generateToken(user), user: user, msg: 'Your profile information has been updated.' });
      }
    });
  });
};

/**
 * DELETE /account
 */
exports.accountDelete = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    res.send({ msg: 'Your account has been permanently deleted.' });
  });
};

/**
 * GET /unlink/:provider
 */
exports.unlink = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    switch (req.params.provider) {
      case 'facebook':
        user.facebook = undefined;
        break;
      case 'google':
        user.google = undefined;
        break;
      case 'twitter':
        user.twitter = undefined;
        break;
      case 'vk':
        user.vk = undefined;
        break;
      case 'github':
          user.github = undefined;
        break;
      default:
        return res.status(400).send({ msg: 'Invalid OAuth Provider' });
    }
    user.save(function(err) {
      res.send({ msg: 'Your account has been unlinked.' });
    });
  });
};

/**
 * POST /forgot
 */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'support@yourdomain.com',
        subject: '✔ Reset your password on Mega Boilerplate',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        res.send({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
        done(err);
      });
    }
  ]);
};

/**
 * POST /reset
 */
exports.resetPost = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
      return res.status(400).send(errors);
  }

  async.waterfall([
    function(done) {
      User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save(function(err) {
            done(err, user);
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        from: 'support@yourdomain.com',
        to: user.email,
        subject: 'Your Mega Boilerplate password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        res.send({ msg: 'Your password has been changed successfully.' });
      });
    }
  ]);
};
