var _ = require('lodash');
const Promise = require('bluebird');

const User = require('../models/User');
const Project = require('../models/Project');
const UserProjectAssocModel = require('../models/UserProjectAssocModel');
const ProjectInvite = require('../models/ProjectInvite');
const AnalyticsController = require('../controllers/analyticsController');

var emailManager = require('../utils/emailManager');
var VoteHelper = require('../utils/voteHelper');

function createProject(project, callback) {
  var projectToCreate = new Project(project);
  projectToCreate.save( (err) => {
    callback(projectToCreate, err);
  });
}

function createProjectUserAssoc(project, user, callback) {
  var userProjectAssoc = new UserProjectAssocModel({
    project,
    user
  });
  userProjectAssoc.save( (err) => {
    callback(userProjectAssoc, err);
  });
}

/******* Create or Update a Project *******/
// app.put('/api/currentUser/project'
exports.currentUserProjectPut = function(req, res) {
  var projectToUpdate = req.body.project;

  //delete properties that should not be updated.
  delete projectToUpdate.slug;
  delete projectToUpdate.updatedAt;
  delete projectToUpdate.createdAt;
  delete projectToUpdate.__v;

  Project.findByIdAndUpdate(req.body.project.id, projectToUpdate)
  .exec( (findUpdateErr, project) => {
    if (!findUpdateErr && !project) {   // Project was not found, and therefore not updated. create a project
      createProject(
        projectToUpdate,
        (projectCreated, err) => {
          createProjectUserAssoc(projectCreated, req.user, (userProjectAssoc, err)=> {
            var projectUrl = "https://www.thehackhive.com/project/" + projectCreated.slug;
            emailManager.sendInternalAlert("New Project Created: " + projectCreated.title, projectUrl + " " + JSON.stringify(projectCreated, null, 2), emailManager.emailInternalAlertEvents().NEW_PROJECT_CREATED);
            emailManager.sendNewProjectEmail(req.user, projectCreated, req, res);
            res.send(projectCreated);
          })
        }
      );
    } else if (findUpdateErr) { // there was some error
      res.status(500).send({msg: 'There was an error'});
    } else if (!findUpdateErr && project) { // project was found, no error, and updated
      var projectUrl = "https://www.thehackhive.com/project/" + project.slug;
      emailManager.sendInternalAlert("Project Updated: " + project.title, projectUrl + " " + JSON.stringify(project, null, 2), emailManager.emailInternalAlertEvents().PROJECT_UPDATE);

      res.send(project);
    }
  });
}

/******* Delete Project *******/
// delete('/api/currentUser/project/:projectId'
// Deletes the project and all associated user assocs
exports.currentUserProjectDelete = function(req, res) {
  Project.findById(req.params.projectId)
  .populate("userProjectAssoc")
  .populate(Project.getTagsAndCreators())
  .exec( (err, projectToDelete) => {
    if ( (projectToDelete && !err && projectToDelete.isUserColaboratorOfProject(req.user)) || req.user.isAdmin ) {
      // delete assocs.
      projectToDelete.userProjectAssoc.forEach( (userProjectAssoc) => {
        UserProjectAssocModel.remove({_id: userProjectAssoc.id}).exec();
      });

      //delete project
      Project.remove({_id: projectToDelete.id}).exec( (err) => {
        if (!err) {
          res.send({msg: "Project Deleted"});
        }
      });
    } else {  // project not deleted - user doesn't have access or not found
      res.status(500).send({msg: 'There was an error'});
    }
  })
}

/******* Get specific project for current user *******/
// used for project editing section
// app.get('/api/currentUser/project/:projectSlug'
exports.currentUserProjectGet = function(req, res) {
  Project.findOne({slug: req.params.projectSlug}) // match on slug or id
  .populate('projectInvites')
  .populate('userProjectAssoc')
  .populate(Project.getTagsAndCreators())
  .exec( (err, project) => {
    if (!err && project) {
      if (project.isUserColaboratorOfProject(req.user)) {   // ensure user is a collaborator of project
        var projectToSend = project;
        projectToSend.projectInvites = project.activeInvites();
        res.send(projectToSend.projectWithBuildersJSON());
      } else {  // current user is not collaborator of project
        res.status(404).send({msg: 'Sorry not found'});
      }
    } else {
      res.status(404).send({msg: 'Sorry not found'});
    }
  });
}

/******* Get all projects from a particular user, regardless of public status *******/
// used to populate project list on my projects page
// app.get('/api/user/projects/'
exports.userProjectsGet = function(req, res) {
  User.findOne({slug: req.user.slug})
  .populate(User.projectsFromUserPopulate())
  .populate('knowsTags')
  .exec( (err, userProfile) =>  {

    // goal: return an array of projects with builders populated.
    // check if there is return value.
    var returnProjectsObject = [];

    // pull out projects from user
    returnProjectsObject = userProfile.userProjectAssoc.map( (userProjectAssoc) => {
      var returnProject = {};
      returnProject = userProjectAssoc.project.toJSON();
      returnProject.userProfileOrder = userProjectAssoc.userProfileOrder;
      return returnProject;
    });

    // for each project, pull out the other collaborators
    returnProjectsObject = returnProjectsObject.map( (project) => {
      // each project
      // return each project with builders populated
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

    })
    res.send(returnProjectsObject);
  });
}

/********* Return 4 projects for the homepage *******/
// app.get('/api/projects'
// app.get('/api/admin/projects'
exports.projectsAllGet = function(req, res) {
  var limit = 4;
  var queryParams = {publicStatus: true};

  // detect if request is coming from admin, if so set a high limit
  if (req.url.indexOf('admin') > -1) {
    // no limits and all projects, regardless project status
    limit = null;
    queryParams = {};
  }

  Project.find(queryParams)
  .limit(limit)
  .populate('techTags')
  .populate('userProjectAssoc')
  .populate(Project.getTagsAndCreators())
  .exec( (err, projects) =>  {
    if (!err && projects && projects.length) {

      if (req.user) {
        // if logged in, add vote state to return object

        var returnProjects = projects.map( (project) => {
          return (project.projectWithBuildersJSON())
        })
        VoteHelper.checkVoteOnProjectsWithUser(returnProjects, req.user, (projectArrayWithVoteStatus) => {
          res.send(projectArrayWithVoteStatus);
        });

      } else {
        // not logged in. normal return
        var returnProjects = projects.map( (project) => {
          return (project.projectWithBuildersJSON())
        })
        res.send(returnProjects);
      }

    }
    else {
      res.status(404).send({msg: 'Sorry not found'});
    }
  })
};

/******* Get a specific project, respects public status *******/
// used to populate main project view.
// app.get('/api/project/:slug'
exports.projectGet = function(req, res) {

  Project.findOne({slug: req.params.slug})
  .populate('techTags')
  .populate('userProjectAssoc')
  .populate(Project.getTagsAndCreators())
  .exec( (err, project) =>  {
    if (!err && project) {
      // record the analytics event. Analytics controller will disgrard.
      AnalyticsController.addImpressionEventToProject(project, req, res);

      // update votes.
      if (req.user) {
        //populate project with vote status
        VoteHelper.checkVoteOnProjectsWithUser([project.projectWithBuildersJSON()], req.user, (projectArrayWithVoteStatus) => {
          var projectWithVoteStatus = projectArrayWithVoteStatus[0];

          if (project.publicStatus) {
            var isCollabStatus = false;
            if (req.user) {
              isCollabStatus = project.isUserColaboratorOfProject(req.user);
            }

            res.send({
              project: projectWithVoteStatus,
              isCollab: isCollabStatus
            });

          } else if (!req.user) {  // project is not public, check if current user is associated with the project
            // Not public and user is not logged in.
            res.status(404).send({msg: 'Sorry project not found'});
          } else if (project.isUserColaboratorOfProject(req.user)) {
            // user is a collaborator
            res.send({
              project: projectWithVoteStatus,
              isCollab: project.isUserColaboratorOfProject(req.user)
            });
          }
        })
      } else {

        // not logged in, but project found
        res.send({
          project: project.projectWithBuildersJSON(),
          isCollab: false
        });
      }
    }
    else {
      res.status(404).send({msg: 'Sorry project not found'});
    }
  })
};

/*************************************************
                      Invites
/*************************************************/

/******* Send a colab invite to a new user on a project, add invite object to project *******/
// app.post('/api/currentUser/project/colabInvite/:projectId'
exports.colabInvitePost = function(req, res) {
  Project.findById(req.params.projectId)
  .populate('techTags')
  .populate('userProjectAssoc')
  .populate('projectInvites')
  .populate(Project.getTagsAndCreators())
  .exec( (err, project) =>  {
    if (!err && project) {
      if (project.isUserColaboratorOfProject(req.user)) {   // ensure user is a collaborator of project
        var projectInvite = new ProjectInvite({
          project,
          invitor: req.user,
          inviteEmailAddress: req.body.inviteEmailAddress
        })
        projectInvite.save( (err) => {
          var projectUrl = "https://www.thehackhive.com/project/" + project.slug;
          emailManager.sendInternalAlert("New Invite Created: " + project.title, projectUrl + " " + JSON.stringify(project, null, 2), emailManager.emailInternalAlertEvents().NEW_COLLAB_INVITE)
          emailManager.sendProjectInviteEmail(projectInvite, req, res);
          res.send({
            projectInvite,
            msg: "Invite sent to: " + projectInvite.inviteEmailAddress
          });
        });
      } else {  /// current user is not a collaborator
        res.status(404).send({msg: 'Sorry project not found'});
      }
    } else {
      res.status(404).send({msg: 'Sorry project not found'});
    }
  });
};

/******* Remove colab invite *******/
// app.delete('/api/project/colabInvite/:inviteId'
exports.colabInviteDel = function(req, res) {
  ProjectInvite.findOneAndRemove({_id: req.params.inviteId})
  .exec( (err, project) =>  {
    res.send({msg: "Invite Removed" });
  });
};

/******* Handle Invite Code *******/
// Associate user with project, based on invite code
// app.post('/api/currentUser/project/invite/inviteCode'

// ensures user can't be added twice to the same project.
// send an email that the project has been claimed to the original sender of the invite.
// send an internal alert

exports.addInviteCodeToProjectPost = function(req, res) {
  ProjectInvite.findOne({inviteCode: req.body.inviteCode})
  .populate('invitor')
  .populate({
    path: 'project',
    populate: [
      {
        path: 'techTags'
      },
      {
        path: 'userProjectAssoc',
        populate: {path: 'user'}
      }
    ]
  })
  .exec( (err, projectInvite) =>  {
    if (!err && projectInvite) {
      if (projectInvite.claimedStatus == 'claimed') {   // project invite has already been claimed. Tell the user.
        res.send({msg: "Invite Code Invalid" });
      } else if (projectInvite.project.isUserColaboratorOfProject(req.user)) {    // User is already associated with project! Return error
        res.send({msg: "You're already associated with this project!" });
      } else {
        createProjectUserAssoc(projectInvite.project, req.user, (userProjectAssoc, err) => {
          projectInvite.claimedStatus = "claimed";
          projectInvite.save( (err) => {

            emailManager.sendInternalAlert("Invite Code / Project Claimed", projectInvite.project, emailManager.emailInternalAlertEvents().COLLAB_INVITE_ACCEPTED);
            emailManager.sendInviteAcceptToInvitorEmail(projectInvite, req.user, req, res);
            res.send({
              status: "success",
              msg: "Project Successfully Added",
              projectAdded: projectInvite.project
            });
          });
        });
      }
    } else {      // Project Invite doesn't exist, tell the user.
      res.send({msg: "Invite Code Invalid :(" });
    }
  });
};

/* Remove User <> Project Assoc */
//app.delete('/api/project/removeUserProjectAssoc'
exports.removeProjectCollaboratorAssocDel = function(req, res) {
  UserProjectAssocModel.findOne({project: req.body.projectId, user: req.body.userId})
  .populate({
      path: 'project',
      populate: Project.getTagsAndCreators()
  })
  .exec( (err, userProjectAssoc) =>  {
    // ensure current user part of this project.
    if (userProjectAssoc.project.isUserColaboratorOfProject(req.user)) {
      if (!err && userProjectAssoc) {
        userProjectAssoc.remove();
        res.send({msg: "successfully removed"})
      } else {
        res.status(404).send({msg: "Association not found"})
      }
    } else {
      res.status(404).send({msg: "Not Authorized"})
    }
  });
};

/******* Project Search *******/
// all projects regardless of setting

// app.get('/api/projects/search/:searchString'
exports.projectsSearch = function(req, res) {
  Project.find({
    "title": { "$regex": req.params.searchString, "$options": "i" }
  })
  .limit(5)
  .populate('userProjectAssoc')
  .populate(Project.getTagsAndCreators())
  .exec( (err, projects) =>  {
    if (!err && projects && projects.length) {
      var returnProjects = projects.map( (project) => {
        return (project.projectWithBuildersJSON())
      })
      res.send(returnProjects);
    }
    else {
      res.status(404).send({msg: 'Sorry not found'});
    }
  });
};

/******* Update Project on user profile Order *******/
// updates the order field of project
// app.post('/api/currentUser/updateProjectOrder',
exports.updateProjectOrderPost = function(req, res) {
  var userProjectOrder = req.body.userProjectState;
  var allUserProjectAssocPromises = []

  userProjectOrder.map ( (project, index) =>  {
    allUserProjectAssocPromises.push(
      UserProjectAssocModel.findOneAndUpdate(
      {
        project: project.id,
        user: req.user.id
      },
      {
        userProfileOrder: project.userProfileOrder
      })
      .exec()
    )
  })

  Promise
  .all(allUserProjectAssocPromises)
  .then( (results) => {
    res.send({msg: "Project Order Upated"})
  })
}

/******* Update Project on user profile Order *******/
// updates the order field of project
// app.post('/api/currentUser/updateProjectOrder',
exports.updateUserOnProjectOrderPost = function(req, res) {
  var projectToUpdate = req.body.projectState;
  var allUserProjectAssocPromises = []

  projectToUpdate.builders.map ( (user, index) =>  {
    allUserProjectAssocPromises.push(
      UserProjectAssocModel.findOneAndUpdate(
      {
        project: projectToUpdate.id,
        user: user._id
      },
      {
        userOnProjectOrder: user.userOnProjectOrder
      })
      .populate("user")
      .exec()
    )
  })

  Promise
  .all(allUserProjectAssocPromises)
  .then( (results) => {
    res.send({msg: "User Order Upated"})
  })
}

/**
 * GET HomePage Projects API
 */
/*
exports.projectHomeGet = function(req, res) {
  WebsiteConfig.findOne({})
  .populate({
    path: 'homePageProjects',
    model: 'Project',
    populate: Project.getTagsAndCreators()
  })
  .populate({
    path: 'homePageProjects',
    model: 'Project',
    populate: {path: 'tags'}
  })
  .exec((err, websiteConfig) => {
    if (!err && websiteConfig) {
      var returnArray = [];
      websiteConfig.homePageProjects.map( (project) => {
        returnArray.push(project.projectWithBuildersJSON())
      })
      res.send(returnArray);
    }
    else {
      res.send('NotFound');
    }
  })
}
*/
