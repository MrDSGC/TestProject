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

var inviteRequestSchema = new mongoose.Schema({
  howDidYouHear: String,
  whyJoin: String,
  type: String,
  projectDesc: String,
  linkedinUrl: String,
  emailRequestInvite: String
}, schemaOptions);

var InviteRequest = mongoose.model('InviteRequest', inviteRequestSchema);
module.exports = InviteRequest;
