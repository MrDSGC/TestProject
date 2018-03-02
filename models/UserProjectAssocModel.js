var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

const User = require('../models/User');
const Project = require('../models/Project');

var Schema = mongoose.Schema;

/*****
Connects a User and Project
***/

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var UserProjectAssocSchema = new mongoose.Schema({
  project: {type: Schema.Types.ObjectId, ref: 'Project'},
	user: {type: Schema.Types.ObjectId, ref: 'User'},
  userProfileOrder: Number,    // defines the order of projects to show on a user profile

  userOnProjectRole: String,           // defines role of a user on a proejct
  userOnProjectOrder: Number,           // defines order of a user on a proejct. When a projct is rendered.

}, schemaOptions);

var UserProjectAssoc = mongoose.model('UserProjectAssoc', UserProjectAssocSchema);
module.exports = UserProjectAssoc;
