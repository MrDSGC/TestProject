const User = require('../models/User');
const UserFollowObject = require('../models/UserFollowObject');
var Promise = require('bluebird');

// Check if user already follows each other
// return boolean value - true - user already follows user.

exports.checkFollowUserFollowStatus = (userDoingFollowing, userBeingFollowed, callBack) => {

  UserFollowObject.findOne({
    followerUser: userDoingFollowing._id,
    toFollowUser: userBeingFollowed._id
  })
  .exec( (err, userFollowObject) => {
    if (!err && userFollowObject) {
      // user follow object found. return true - user follows each other.
      callBack(true);
    } else {
      callBack(false);
    }
  });
};
