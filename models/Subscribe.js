var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var SubscribeSchema = new mongoose.Schema({
  eventObject: {type: Schema.Types.ObjectId, ref: 'EventObject'},
	user: {type: Schema.Types.ObjectId, ref: 'User'},

  verifyEmailToken: String,
  emailAddress: String,
  emailConfirmed: Boolean

}, schemaOptions);

var Subscribe = mongoose.model('Subscribe', SubscribeSchema);
module.exports = Subscribe;
