const User = require('../models/User');
const Project = require('../models/Project');
const UserProjectAssocModel = require('../models/UserProjectAssocModel');
const Vote = require('../models/Vote');
const AnalyticsController = require('../controllers/analyticsController');
const FollowHelper = require('../utils/followHelper');


import _ from 'lodash';
var Promise = require('bluebird');

var VoteHelper = require('../utils/voteHelper')

// used to populate profile on profile main
exports.profileGet = function(req, res) {
  User.findOne({slug: req.params.slug})
  .populate(User.projectsFromUserPopulate())
  .populate('knowsTags')
  .exec( (err, userProfile) =>  {
    if (!err && userProfile && !userProfile.isSuspended) {
      var userProfileJSON = userProfile.toJSON();

      //Pull out projects
      var returnProjectsObject = [];

      // pull out projects from user
      returnProjectsObject = userProfile.userProjectAssoc.map( (userProjectAssoc) => {
        var returnProject = {};
        returnProject = userProjectAssoc.project.toJSON();
        returnProject.userProfileOrder = userProjectAssoc.userProfileOrder;

        return returnProject;
      });

      // filter out none public projects
      returnProjectsObject =
        returnProjectsObject.filter( (project) => {
          if (project.publicStatus) {
            return project;
          } else {
            return false;
          }
        })

      // return each project with builders populated
      returnProjectsObject = returnProjectsObject.map( (project) => {
        // each project
        var returnedProject = project;

        // filer out the bad assocs.
        returnedProject.userProjectAssoc = returnedProject.userProjectAssoc.filter( (userProjectAssocToCheck) => {
          if(userProjectAssocToCheck.user) {
            return true;
          } else {
            return false;
          }
        });

        // pull out each collaborator and store them in builder
        returnedProject.builders = returnedProject.userProjectAssoc.map( (userProjectAssoc) => {
          var builderReturn = userProjectAssoc.user;
          builderReturn.userOnProjectOrder = userProjectAssoc.userOnProjectOrder;
          builderReturn.userOnProjectRole = userProjectAssoc.userOnProjectRole;
          return builderReturn;
        });
        return returnedProject;
      });

      // Add projects to userprofilejson
      userProfileJSON.projects = returnProjectsObject;

      // add vote status to projects based on current user
      // currentUserAlreadyVoted: true <- the current user has already voted on this project
      if (req.user) {

        FollowHelper.checkFollowUserFollowStatus(req.user, userProfileJSON, (followStatus) => {
          userProfileJSON.currentUserAlreadyFollows = followStatus;

          VoteHelper.checkVoteOnProjectsWithUser(userProfileJSON.projects, req.user, (projects)=>{
            AnalyticsController.addImpressionEventToUser(userProfile, req, res);
            var returnUserProfileJSON = userProfileJSON;
            returnUserProfileJSON.projects = projects;

            res.send(returnUserProfileJSON);
          });
        });

      } else {
        // user isn't logged in so let them vote on project
        res.send(userProfileJSON);
      }
    }
    else {
      res.status(404).send({msg: 'Sorry not found'});
    }
  })
};
