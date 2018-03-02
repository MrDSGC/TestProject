const User = require('../models/User');
const Project = require('../models/Project');
const Vote = require('../models/Vote');
var Promise = require('bluebird');

// Check if votes exist between a user and an array of projects.
// return project with currentUserAlreadyVoted
// currentUserAlreadyVoted: true <- the current user has already voted on this project

exports.checkVoteOnProjectsWithUser = (projects, user, callBack) => {

  // 1. setup promises array. user and project to check vote
  // 2. run the promise. check what votes exist.
  // 3. map those promise results back to the project return object

  // Step 1. Setup Promises
  var allVotePromises = [];
  projects.map( (project) => {
    //setup a promise to check if the user has already voted on this project
    allVotePromises.push(Vote.findOne({user: user.id, project: project.id}).exec());
  })

  // Step 2. Run Promises
  Promise
  .all(allVotePromises)
  .then( (results) => {
    // Step 3. Map and teturn the results
    var projectReturnObject = projects.map( (project, index) => {
      var returnProject = project;
      if (results[index]) {
        returnProject.currentUserAlreadyVoted = true;
      } else {
        returnProject.currentUserAlreadyVoted = false;
      }
      return returnProject;
    })

    callBack(projectReturnObject);
  });
};
