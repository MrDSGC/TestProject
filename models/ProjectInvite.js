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

var projectInviteSchema = new mongoose.Schema({
  invitor: {type: Schema.Types.ObjectId, ref: 'User'},
  inviteCode: String,
  inviteEmailAddress: String,
  project: {type: Schema.Types.ObjectId, ref: 'Project'},
  role: String,
  claimedStatus: String,
}, schemaOptions);

projectInviteSchema.pre('save', function(next) {
  var projectInvite = this;
  projectInvite.inviteCode = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  if (!projectInvite.inviteCode) {
    for (var i = 0; i < 5; i++) {
      projectInvite.inviteCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    next();
  } else {
    next();
  }
});

var ProjectInvite = mongoose.model('ProjectInvite', projectInviteSchema);
module.exports = ProjectInvite;
