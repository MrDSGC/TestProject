var crypto = require('crypto');

const EventObject = require('../models/EventObject');
const Subscribe = require('../models/Subscribe');
const User = require('../models/User');

var emailManager = require('../utils/emailManager');

// Create Subscribe Object.
// Assuming all deduping is done.
var createSubscribe = (eventObjectId, userObject, emailAddress, req, res, callBack) => {
  var subscribeObject = {}
  EventObject.findById(eventObjectId)
  .exec( (err, eventObject) =>  {

    if( !err && eventObject) {
      if (userObject) {

        // subscribe right away.
        subscribeObject = new Subscribe({
          eventObject: eventObject,
          user: userObject
        });

        subscribeObject.save( (err) => {
          eventObject.incrementSubscribeCountAndSave();
          emailManager.sendInternalAlert("Subscribe added to Event: " + eventObject.slub, subscribeObject, emailManager.emailInternalAlertEvents().SUBSCRIBE_ADDED);
          callBack (subscribeObject);
        });

      } else if (emailAddress) {
        // there is an email address,
        // send an email and generate token

        crypto.randomBytes(16, function(err, buf) {
          var token = buf.toString('hex');

          subscribeObject = new Subscribe({
            eventObject: eventObject,
            emailAddress,
            emailConfirmed: false,
            verifyEmailToken: token
          });

          subscribeObject.save( (err) => {
            if (!err) {
              callBack (subscribeObject);
            }
          });
        });
      }
    }
  })
}

/**
 * Post /api/eventObject/addSubscribe
 */
exports.eventObjectSubscribePost = function(req, res) {
  var eventObjectId = req.body.eventObjectId;
  var emailAddress = req.body.emailAddress;

  var queryParam = {};

  if (req.user) {
    queryParam = {
      eventObject: eventObjectId,
      user: req.user.id
    }
  } else if (emailAddress) {
    queryParam = {
      eventObject: eventObjectId,
      emailAddress,
    }
  } else {
    res.send({msg: "there is a bug 🕷"});
    return;
  }

  //check if already subscribed on
  Subscribe.findOne(queryParam)
  .exec( (err, subscribeObject) => {
    if (!err && subscribeObject ) {

      // subscribe object found
      // already subscribed
      res.send({msg: "You are already subscribed :(", status: "invalid"});
    } else {

      // not subscribed, create subscribe
      if (req.user) {
        createSubscribe(eventObjectId, req.user, null, req, res, (subscribeObject) => {
          res.send({
            subscribeObject,
            msg: "Yay! Your subscription was created!",
            status: "validAndAdded"
          });
        });
      } else {
        // Doing an email subscribe
        createSubscribe(eventObjectId, null, emailAddress, req, res, (subscribeObject) => {
          // ensure that project is populated in voteObject
          //emailManager.sendEmailToConfirmVote(voteObject, req, res);
          emailManager.sendInternalAlert("EMAIL Subscribe, waiting confirmation, Event: " + subscribeObject.eventObject.slug, subscribeObject, emailManager.emailInternalAlertEvents().SUBSCRIBE_CREATED_WAITING_EMAIL_CONFIRM);
          res.send({
            subscribeObject,
            msg: "Yay! Please confirm your email to finish subscribing.",
            status: "validAndNeedToConfirm"
          });
        });
      }
    }
  });
}


/**
 * get /api/eventObject/:eventObjectId
 */
exports.eventObjectGet = function(req, res) {
  var eventObjectId = req.params.eventObjectId;

  EventObject.findById(eventObjectId)
  .exec( (err, eventObject) =>  {
    if( !err && eventObject) {
      res.send({eventObject});
    } else {
      res.status(404).send({msg: "Adding an Event Object"});
    }
  });
}
