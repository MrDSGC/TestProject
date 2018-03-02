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

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  slug: String,
  slugUpdateRequired: Boolean,

  email: { type: String, unique: true},
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  provider: String,
  facebookProfileId: String,
  facebookToken: String,

  gender: String,
  location: String,
  website: String,
  profilePicUrl: String,

  aboutMeDescription: String,

  knowsTags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
  links: [
    {
      "linkType": String,
      "friendlyLabel": String,
      "url": String
    }
  ],

  initialProfileComplete: Boolean,
  initialProjectComplete: Boolean,

  featureFlags: [
    {
      featureName: String,
      featureValue: String
    }
  ],

  isAdmin: Boolean,
  adminEmailAddress: String,
  emailAlertEventSubscriptions: [String],       // subscribe specifically to events.
  emailNOTAlertEventSubscriptions: [String],    // Do not receive events

  isSuspended: Boolean,
  signUpInviteObject: {type: Schema.Types.ObjectId, ref: 'SignUpInvite'},

  // Follower Count
  userFollowerCount: Number,    // Number of people that follow this user
  userFollowingCount: Number,   // Number of people that this user follows.

  // Dynamically Populated, Stored with User Project Assoc. Populated when project is rendered
  userOnProjectOrder: Number, // The order the user shhould appear on a project
  userOnProjectRole: String

}, schemaOptions);

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.virtual('gravatar').get(function() {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

userSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  }
};

// Followers - Following Object Setup

// followers - get follower object who follow this user.
userSchema.virtual('userFollowers', {
  ref: 'UserFollowObject',
  localField: '_id',
  foreignField: 'toFollowUser',     //follow objects that point at this user.
});

// following - get people who this user follows.
userSchema.virtual('userFollowing', {
  ref: 'UserFollowObject',
  localField: '_id',
  foreignField: 'followerUser',
});

userSchema.virtual('userProjectAssoc', {
  ref: 'UserProjectAssoc',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('analytics', {
  ref: 'Analytics',
  localField: '_id',
  foreignField: 'objectPointer'
});

// **** Populate Helper ****//
userSchema.statics.projectsFromUserPopulate = function () {
  return  {
    path: 'userProjectAssoc',
    populate: {
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
    }
  };
}

userSchema.methods.projects = function() {
  var projects = [];

  if (!this.userProjectAssoc) {
    return projects;
  }

  // ensure project assoc is safe
  this.userProjectAssoc.filter( (userProjectAssoc)=> {
    if (userProjectAssoc.project) {
      return userProjectAssoc;
    } else {
      return false;
    }
  })
  .map( (userProjectAssoc) => {
    var projectToReturn = userProjectAssoc.project.toJSON();
    projectToReturn.userProfileOrder = userProjectAssoc.userProfileOrder;
    projectToReturn.builders = userProjectAssoc.project.creators()

    projects.push(projectToReturn)
  })

  return projects;
}

userSchema.methods.getUserProductionURL = function() {
  var rootURL = "https://www.thehackhive.com/profile/"

  var urlToReturn = rootURL + this.slug;
  return urlToReturn;
}

var User = mongoose.model('User', userSchema);
module.exports = User;
