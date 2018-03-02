// addes url redirects to. thehackhive.com/:redirectSlug

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

var urlRedirectSchema = new mongoose.Schema({
  redirectSlug: String,
  toUrl: String,

  // MetaTags
  metaTagTitle: String,
  metaTagDescription: String,
  metaTagImageURL: String,

  // Redirect Analytics
  urlRedictCount: Number,       // number of times this redirect has been hit.
  urlRedirectEvents: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    redirectTime: Date
  }]
}, schemaOptions);

var UrlRedirect = mongoose.model('UrlRedirect', urlRedirectSchema);
module.exports = UrlRedirect;
