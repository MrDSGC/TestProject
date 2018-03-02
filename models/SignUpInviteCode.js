var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

var signUpInviteSchema = new mongoose.Schema({
  inviteCode: String,
  type: String,
  claimedStatus: String,
  description: String,
  title: String,

  // helper fields. prepopulates sign ups.
  helperFirstName: String,
  helperLastName: String,
  helperProfilePic: String,

}, schemaOptions);

/*****  Virtuals and Helper Functions *****/
signUpInviteSchema.virtual('usersWithSignUpInviteCode', {
  ref: 'User',
  localField: '_id',
  foreignField: 'signUpInviteObject'
});

signUpInviteSchema.methods.checkSignupInviteCodeStatusAndUpdate = function() {
  // return true == continue with account creation, claimcode was updated as well.
  // return false == claim code invalid, stop the sign up process.

  if (this.claimedStatus == 'claimed') {
    return false;
  } else {
    // not claimed yet.
    if (this.type == 'unlimited') {
      // unlimited invite code, return and don't update
      return true;
    } else if (this.type == 'single') {
      this.claimedStatus = 'claimed';
      this.save();
      return true;
    }
  }
}

var SignUpInvite = mongoose.model('SignUpInvite', signUpInviteSchema);
module.exports = SignUpInvite;
