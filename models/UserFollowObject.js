// User Following Object. Only used for following users. Another object setup for other follow types - tags, projects, etc.

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

var userFollowObjectSchema = new mongoose.Schema({
  followerUser: {type: Schema.Types.ObjectId, ref: 'User'},     // person doing the following
  toFollowUser: {type: Schema.Types.ObjectId, ref: 'User'},     // person to follow

  emailAddressOfFollower: String    // used when a user does't

}, schemaOptions);

var UserFollowObject = mongoose.model('UserFollowObject', userFollowObjectSchema);
module.exports = UserFollowObject;
