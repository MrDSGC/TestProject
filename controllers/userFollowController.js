const User = require('../models/User');
const UserFollowObject = require('../models/UserFollowObject')
const emailManager = require('../utils/emailManager');

// Add a follow from the current user to follow someone else
// app.post('/api/userFollow/addFollowFromCurrentUserToAnotherUser
exports.addFollowFromCurrentUserToAnotherUserPost = function(req, res) {
  /*********************
  Add User Follow Logic

  //1. Get user to follow. Make sure it exists.
  //2. Check if current user is logged in
    - If logged in,
    - Check if follow object exists.
    - If not create one, if it does, return an error.
    - return status message

  If user is not logged in, create a follow object with email.
    - make sure email is good. block if necessary.
    - create a follow object for email.
    - return status message

  *********************/
  var userToFollowId = req.body.userToFollowId;

  //Get user to follow
  User.findById(userToFollowId)
  .exec( (err, userToFollow) => {
    if (!err && userToFollow) {
      // userToFollow exists. Great!

      if (req.user) {
        // user is logged in. Check and create a follow object
        // check if user follow object already exists
        UserFollowObject.findOne({
          followerUser: req.user.id,      // current user is the follower
          toFollowUser: userToFollowId
        })
        .exec( (err, userFollowObject) => {
          if (!err && userFollowObject) {
            // user to follow object already exits.
            // return a message that you already follow this user. This should never happen. But just in case.
            res.send({
              status: 'invalid',
              msg: "You already follow this user"
            });
          } else {
            // user follow object doesn't exist. create one and save it.
            var userFollowObject = new UserFollowObject({
              followerUser: req.user.id,     // current user is the follower
              toFollowUser: userToFollowId       // user to follow
            });

            userFollowObject.save( (err)=> {

              //var incrementFollowCountsForUsers = (userFollowObject, callBack)
              incrementFollowCountsAndAlert(userFollowObject, (successStatus, userDoingFollowingCount, userBeingFollowedCount) => {
                emailManager.newFollowNotificationToUserBeingFollowed(userFollowObject, req, res);

                res.send({
                  status: 'validAndAdded',
                  userDoingFollowingCount,
                  userBeingFollowedCount
                })
              })
            });
          }
        });
      } else {
        // user is not logged in. Create follow with email.

        // user follow object doesn't exist with email and email is good. create a follow object and save it.
        var userFollowObject = new UserFollowObject({
          emailAddressOfFollower: req.body.emailAddressToAddToFollower,     // current user is the follower
          toFollowUser: userToFollow       // user to follow
        });

        userFollowObject.save( (err)=> {
          res.send({
            status: 'validAndAdded',
          })
        });
      }
    } else {
      // user to follow not found.
      res.status(404).send({msg: "There was an error"})
    }
  });
}

// Get followers from a user. Returns a list of users
// app.get('/api/userFollow/getUserFollowers/:userToGetFollowersId
exports.getUserFollowers = function(req, res) {
  // Get all follower objects for the user.
  // return all user objects

  UserFollowObject.find({
    toFollowUser: req.params.userToGetFollowersId
  })
  .populate('followerUser')
  .exec( (err, UserFollowObjects) => {
    if (!err && UserFollowObjects) {
      // Get users to return
      var followerReturnArray = []
      followerReturnArray = UserFollowObjects.map( (UserFollowObject) => {
        return UserFollowObject.followerUser;
      })
      res.send({
        userFollowList: followerReturnArray
      });
    } else {
      res.status(404).send({msg: "Not found"})
    }
  });
}

// Get following from a user. Who the user follows. Returns a list of users
// app.get('/api/userFollow/getUserFollowing/:userToGetFollowingId
exports.getUserFollowing = function(req, res) {
  // Get all follower objects for the user.
  // return all user objects

  UserFollowObject.find({
    followerUser: req.params.userToGetFollowingId
  })
  .populate('toFollowUser')
  .exec( (err, UserFollowObjects) => {
    if (!err && UserFollowObjects) {
      // Get users to return
      var userFollowingReturnArray = []
      userFollowingReturnArray = UserFollowObjects.map( (UserFollowObject) => {
        return UserFollowObject.toFollowUser;
      })
      res.send({
        userFollowList: userFollowingReturnArray
      });
    } else {
      res.status(404).send({msg: "Not found"})
    }
  });
}

// Helper Function - Increment Counts for users.
// Sends an internal alert for user follow
// Increment Follower Count
// Increment Following Count

var incrementFollowCountsAndAlert = (userFollowObject, callBack) => {
  UserFollowObject.findById(userFollowObject._id)
  .populate([
    'followerUser',
    'toFollowUser'
  ])
  .exec( (err, userFollowObject) => {
    // first increment follower count, then following count.
    var userDoingFollowingObject = userFollowObject.followerUser;
    if (userDoingFollowingObject.userFollowingCount) {
      userDoingFollowingObject.userFollowingCount = userDoingFollowingObject.userFollowingCount + 1;
    } else {
      userDoingFollowingObject.userFollowingCount = 1;
    }

    userDoingFollowingObject.save( (err) => {
      var userBeingFollowedObject = userFollowObject.toFollowUser;
      if (userBeingFollowedObject.userFollowerCount) {
        userBeingFollowedObject.userFollowerCount = userBeingFollowedObject.userFollowerCount + 1;
      } else {
        userBeingFollowedObject.userFollowerCount = 1;
      }

      userBeingFollowedObject.save( (err) =>  {
        emailManager.sendInternalAlert(
          userDoingFollowingObject.firstName +
          " follows " +
            userBeingFollowedObject.firstName
          ,
          userDoingFollowingObject.getUserProductionURL() + "\n Follows \n" + userBeingFollowedObject.getUserProductionURL(),
          emailManager.emailInternalAlertEvents().NEW_USER_FOLLOW_EVENT
        )

        callBack(
          {status: "success"},
          userDoingFollowingObject.userFollowingCount,
          userBeingFollowedObject.userFollowerCount
        );
      });
    });
  });
}
