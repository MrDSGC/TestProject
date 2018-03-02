var crypto = require('crypto');

const Vote = require('../models/Vote');
const Project = require('../models/Project');
const User = require('../models/User');

var emailManager = require('../utils/emailManager');

// Create Vote Object.
// Assuming all deduping is done.
var createVote = (projectId, userObject, emailAddress, req, res, callBack) => {

  var voteObject = {}
  Project.findById(projectId)
  .populate(Project.getTagsAndCreators())
  .exec( (err, projectObject) =>  {
    if( !err && projectObject) {
      if (userObject) {

        // Vote right away.
        voteObject = new Vote({
          project: projectObject,
          user: userObject
        });

        voteObject.save( (err) => {
          projectObject.incrementVoteCountAndSave();
          emailManager.sendInternalAlert("Vote added to Project: " + projectObject.title, voteObject, emailManager.emailInternalAlertEvents().VOTE_CREATED_AND_COUNTED);
          emailManager.newVoteNotificationsToProjectOwners(projectObject, projectObject.projectWithBuildersJSON().builders, req, res);
          callBack (voteObject);
        });

      } else if (emailAddress) {
        // there is an email address,
        // send an email and generate token

        crypto.randomBytes(16, function(err, buf) {
          var token = buf.toString('hex');

          voteObject = new Vote({
            project: projectObject,
            emailAddress,
            emailConfirmed: false,
            verifyEmailToken: token
          });

          voteObject.save( (err) => {
            if (!err) {
              callBack (voteObject);
            }
          });
        });
      }
    }
  })
}

/**
 * Post /api/vote/projectVote
 */
exports.projectVotePost = function(req, res) {
  var projectId = req.body.projectId;
  var emailAddress = req.body.emailAddress;

  var queryParam = {};

  if (req.user) {
    queryParam = {
      project: projectId,
      user: req.user.id
    }
  } else if (emailAddress) {
    queryParam = {
      project: projectId,
      emailAddress,
    }
  } else {
    res.send({msg: "there is a bug 🕷"});
    return;
  }

  //check if already voted on
  Vote.findOne(queryParam)
  .exec( (err, voteObject) => {
    //if (false) {
    if (!err && voteObject ) {

      // vote object found
      // already voted
      res.send({msg: "You already voted :(", status: "invalid"});
    } else {
      // not voted, create vote
      if (req.user) {
        createVote(projectId, req.user, null, req, res, (voteObject) => {
          res.send({
            voteObject,
            msg: "Yay! Your vote was created!",
            status: "validAndAdded"
          });
        });
      } else {
        createVote(projectId, null, emailAddress, req, res, (voteObject) => {
          // ensure that project is populated in voteObject
          emailManager.sendEmailToConfirmVote(voteObject, req, res);
          emailManager.sendInternalAlert("EMAIL Vote, waiting confirmation, Project: " + voteObject.project.title, voteObject, emailManager.emailInternalAlertEvents().VOTE_CREATED_WAITING_EMAIL_CONFIRM);
          res.send({
            voteObject,
            msg: "Yay! Please confirm your email to finish voting.",
            status: "validAndNeedToConfirm"
          });
        });
      }
    }
  });
}

/*
Confirm Email Token, Vote on Project
*/
exports.confirmEmailTokenGet = function(req, res) {
  var verifyEmailToken = req.params.verifyEmailToken;

  Vote.findOne({
    verifyEmailToken
  })
  .populate({
    path: 'project',
    populate: Project.getTagsAndCreators()
  })
  .exec( (err, voteObject) =>  {
    if (!err && voteObject) {

      if (!voteObject.emailConfirmed) {
        //email is not confirmed, confirm email, increase the vote.
        voteObject.project.incrementVoteCountAndSave();
        emailManager.sendInternalAlert("EMAIL Vote added to Project: " + voteObject.project.title, voteObject, emailManager.emailInternalAlertEvents().VOTE_CLAIMED_EMAIL_CONFIRMED);
        emailManager.newVoteNotificationsToProjectOwners(voteObject.project, voteObject.project.projectWithBuildersJSON().builders, req, res);
        voteObject.emailConfirmed = true;
        voteObject.save( (err) => {

          var returnVoteObject = voteObject.toJSON();
          returnVoteObject.project = voteObject.project.projectWithBuildersJSON();

          if (!err) {
            res.send({
              msg: "Yay! Your vote has been counted!",
              status: "validAndAdded",
              voteObject: returnVoteObject
            });
          } else {
            res.status(404).send({msg: "Not found"})
          }
        });
      } else {

        // email is already confirmed. Let the user know
        res.send({
          status: "notAddedButExists",
          voteObject,
          msg: "Email is already confirmed, and vote has already been counted."
        })
      }
    } else {
      res.status(404).send({msg: "Not found"})
    }
  });
}

/*
Get all votes for a project
*/

// Get /api/vote/projectVote
exports.projectVoteGet = function(req, res) {
  Project.findById(req.params.projectId)
  .populate('votes')
  .exec( (err, projectObject) =>  {
    if (!err && projectObject) {
      res.send(projectObject.votes)
    } else {
      res.status(404).send({msg: "Not found"})
    }
  });
}
