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

var tagSchema = new mongoose.Schema({
  slug: String,
  friendlyName: String,
  type: String,
  description: String,
  logoURL: String,
  links: [{
    linkType: String,
    friendlyLabel: String,
    url: String,
    order: Number
  }]
}, schemaOptions);

/*****  Virtuals and Helper Functions *****/
tagSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'techTags'
});

tagSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'knowsTags'
});

var Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
