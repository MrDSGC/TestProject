var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var projectSchema = new mongoose.Schema({
  slug: String,
  title: String,
  publicStatus: Boolean,
  shortDescription: String,
  projectLogo: String,
  heroImageUrl: String,
  links: [{
    linkType: String,
    friendlyLabel: String,
    url: String,
    order: Number
  }],
  details: [{
    title: String,
    body: String,
    media: [{
      mediaURL: String,
      mediaDescription: String
    }]
  }],
  techTags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
  invites: [{type: Schema.Types.ObjectId, ref: 'ProjectInvite'}],
  voteCount: Number,

  //Dynamically Populated from assoc in function. From the perspective of a user
  userProfileOrder: Number,   // what order should this project be shown on a user's profile?
  userProjectRole: String            // what should be a user's role this get displayed on?

}, schemaOptions);

projectSchema.pre('save', function(next) {
  var project = this;

  // if there is no slug, generate one.
  if (project.title && !project.slug) {
    var slug = Date.now().toString() + '-' + project.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    this.slug = slug;
  }
  next();
});

// **** Populate Helper ****//
projectSchema.statics.getTagsAndCreators = function () {
  return [{
    path: 'userProjectAssoc',
    populate: {
      path: 'user'
    }
   },
   {
     path: 'techTags'
   }]
}

/*****  Virtuals and Helper Functions *****/
projectSchema.virtual('userProjectAssoc', {
  ref: 'UserProjectAssoc',
  localField: '_id',
  foreignField: 'project'
});

projectSchema.virtual('projectInvites', {
  ref: 'ProjectInvite',
  localField: '_id',
  foreignField: 'project'
});

projectSchema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'project'
});

projectSchema.virtual('analytics', {
  ref: 'Analytics',
  localField: '_id',
  foreignField: 'objectPointer'
});

projectSchema.methods.incrementVoteCountAndSave = function() {
  if (this.voteCount) {
    this.voteCount++;
  } else if (this.voteCount == 0) {
    this.voteCount++;
  } else {
    this.voteCount = 0;
  }
  this.save( (err) => {
  });
  return true;
}

projectSchema.methods.creators = function() {
  var creators = [];
  if (!this.userProjectAssoc) {
    return creators;
  }
  this.userProjectAssoc.map( (userProjectAssoc) => {
    if (userProjectAssoc.user) {
      var userToPush = userProjectAssoc.user;
      userToPush.userOnProjectOrder = userProjectAssoc.userOnProjectOrder;
      userToPush.userOnProjectRole = userProjectAssoc.userOnProjectRole;

      creators.push(userToPush)
    }
  })

  return creators;
}

projectSchema.methods.activeInvites = function() {
  var activeInvites = [];
  if (!this.projectInvites) {
    return activeInvites;
  }
  activeInvites = this.projectInvites.filter( (projectInvite) => {
    if (projectInvite.claimedStatus == "claimed") {
      return false;
    } else {
      return true;
    }
  });
  return activeInvites;
}

// Checks if user is a colaborator of the project
projectSchema.methods.isUserColaboratorOfProject = function(userToCheck) {
  var isColab = false;
  var projectColabs = this.creators();
  projectColabs.map( (colab) => {
    if (colab._id.equals(userToCheck._id)) {
      isColab = true;
    }
  })
  return isColab;
}

/**** Returns a project JSON object with builders populated **/
projectSchema.methods.projectWithBuildersJSON = function() {
  var returnObject = this.toJSON();
  returnObject.builders = this.creators();
  return returnObject;
}

var Project = mongoose.model('Project', projectSchema);
module.exports = Project;
