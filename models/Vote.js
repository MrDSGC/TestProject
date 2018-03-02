var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var VoteSchema = new mongoose.Schema({
  project: {type: Schema.Types.ObjectId, ref: 'Project'},
	user: {type: Schema.Types.ObjectId, ref: 'User'},

  verifyEmailToken: String,
  emailAddress: String,
  emailConfirmed: Boolean

}, schemaOptions);

var Vote = mongoose.model('Vote', VoteSchema);
module.exports = Vote;
