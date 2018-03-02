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

var eventObjectSchema = new mongoose.Schema({
  slug: String,
  friendlyName: String,
  type: String,
  description: String,
  eventImage: String,
  links: [{
    linkType: String,
    friendlyLabel: String,
    url: String,
    order: Number
  }],
  subscribeCount: Number
}, schemaOptions);

/*****  Virtuals and Helper Functions *****/
eventObjectSchema.virtual('subscribers', {
  ref: 'Subscribe',
  localField: '_id',
  foreignField: 'eventObject'
});

eventObjectSchema.methods.incrementSubscribeCountAndSave = function() {
  if (this.subscribeCount) {
    this.subscribeCount++;
  } else if (this.subscribeCount == 0) {
    this.subscribeCount++;
  } else {
    this.subscribeCount = 0;
  }
  this.save( (err) => {
  });
  return true;
}

var EventObject = mongoose.model('EventObject', eventObjectSchema);
module.exports = EventObject;
