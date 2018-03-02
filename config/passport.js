const passport = require('passport');
const User = require('../models/User');
const FacebookStrategy = require('passport-facebook').Strategy;
var emailManager = require('../utils/emailManager');

function generateToken(user) {
  var payload = {
    iss: 'www.thehackhive.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

var callBackUrl = "https://www.thehackhive.com/facebook/callback"

if (process.env.serverEnv === "development") {
  callBackUrl = "http://localhost:3000/facebook/callback"
}

passport.use(new FacebookStrategy({
    clientID        : '156601485062315',
    clientSecret    : '0781456a69d52f4f57077853e6808dd3',
    callbackURL     : callBackUrl,
    profileFields   : ['id', 'email', 'name', 'gender', 'picture.type(large)', 'profileUrl']
 },
 function(token, refreshToken, profile, done) {

   User.findOne({facebookProfileId: profile.id}).exec( (err, user) => {
     if(user) {
       return done(null, user);
     } else {

       const user = new User({
         facebookProfileId: profile.id,
         firstName: profile.name.givenName,
         lastName: profile.name.familyName,
         email: profile.emails[0].value,
         profilePicUrl: profile.photos[0].value,
         slug: Date.now()                             // add a temp slug to prevent errors
       });

       user.save( (err) => {
         var emailSubject = "New User Signed Up - Facebook: " + user.firstName + " " + user.lastName + " " + user.email;
         var profileUrl = "https://www.thehackhive.com/profile/" + user.id;
         emailManager.sendInternalAlert(emailSubject, profileUrl + " " + JSON.stringify(user, null, 2))
         return done(null, user);
       });

     }
   })
  }
))
