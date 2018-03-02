var crypto = require('crypto');

const Vote = require('../models/Vote');
const Project = require('../models/Project');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

/**
 * AddImpressionEventToProject
 */
 // Adds analytics object and connects it with original object
 // Assuming creators is populated.
exports.addImpressionEventToProject = function(project, req, res) {
  /* Rules for adding Impression Event:
  1. Don't add if user is a collaborator of the project.
  2. Don't add analytics if the project is private.
  */

  if(project && project.publicStatus) {
    // project is public
    if (req.user) {

      // user is logged in
      if(!project.isUserColaboratorOfProject(req.user)) {
        // user is not a collaborator of the project.
        addAnalyticsEvent(project, req, res);
      }

    } else {
      // user is not logged in
      // record an impression event.
      addAnalyticsEvent(project, req, res);
    }
  }
}

/**
 * AddImpressionEventToUser
 */
 // Adds analytics object and connects it with original object
exports.addImpressionEventToUser = function(user, req, res) {
  /* Rules for adding Impression Event:
  1. Don't add add an analytics event for your own user.
  */

  if(user) {    // error checking

    if (req.user) {
      // user is logged in
      if(user.id != req.user.id) {
        // not current user. record an impression
        addAnalyticsEvent(user, req, res);
      }

    } else {
      // user is not logged in
      // record an impression event.
      addAnalyticsEvent(user, req, res);
    }
  }
}


function addAnalyticsEvent(object, req, res) {
  var newAnalyticsObject = new Analytics({
    objectPointer: object.id,
    objectPointerType: object.collection.collectionName,

    eventType: "IMPRESSION",
    eventDate: Date.now(),
    dataImpression: {
      referrerUrl: req.query.referer,
      user: req.user
    }
  })

  newAnalyticsObject.save( (err) => {
  });
}

/**
 * Get Impression Events for any object
 */
// Adds analytics object and connects it with original object
//app.get('/api/analytics/:objectType/:objectId'

exports.objectImpressionEventsGet = function(req, res) {
  Analytics.find({objectPointer: req.params.objectId})
  .exec( (err, analyticsObjects)=> {
    if (!err && analyticsObjects) {
      var analyticsEvents = analyticsObjects;
      var numberOfEvents = analyticsObjects.length;
      res.send(analyticsEvents);
    } else {
      res.status(404).send({msg: "can't find it :("});
    }
  })
}


/*
{
  2-1:
    {
      views:
      refererDomains: [

    ]}

  2-2:
    {
      views:
      refererDomains: []
  }
}
*/


/****************** To complete ************/


/**
 * AddImpressionEventToUserProfile
 */
 // Adds analytics object and connects it with original object
exports.addImpressionEventToUserProfile = function(user, res, req) {
  console.log(user)
  console.log(user.collection.collectionName)

  var newAnalyticsObject = new Analytics({
    objectPointer: user.id,
    objectPointerType: user.collection.collectionName,

    eventType: "IMPRESSION",
    eventDate: Date.now(),
    dataImpression: {
      referrerUrl: req.header['Referer'],
      user: req.user
    }
  })

  console.log(newAnalyticsObject)
  newAnalyticsObject.save();
}

/**
 * Get Impression Events for project
 */
 // Adds analytics object and connects it with original object
exports.getImpressionEventsForuser = function(userId, callBack) {

/*
  User.findById("5a78ac3df4d6951c9669b351")
  .populate('analytics')
  .exec( (err, userObject)=> {
    console.log("here", userObject.analytics)
  })
*/

  Analytics.find({objectPointer: "5a78ac3df4d6951c9669b351" })
  .populate("users")
  .exec( (err, analytics) => {
    console.log("users", analytics[0].users)
  })

}
