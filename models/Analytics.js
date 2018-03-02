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

var analyticsSchema = new mongoose.Schema({

  objectPointer: Schema.Types.ObjectId,
  objectPointerType: String,
  eventType: String,
  eventDate: Date,

  dataImpression: {
    referrerUrl: String,
    referrerDomain: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
  }

}, schemaOptions);

analyticsSchema.virtual('users', {
  ref: 'User',
  localField: 'objectPointer',
  foreignField: '_id',
});

analyticsSchema.virtual('projects', {
  ref: 'Project',
  localField: 'objectPointer',
  foreignField: '_id',
});


var Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
