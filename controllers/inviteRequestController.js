var InviteRequest = require('../models/InviteRequest');
var emailManager = require('../utils/emailManager');

// create a request invite.
//app.post('/api/inviteRequest
exports.inviteRequestPost = function(req, res) {
  var inviteRequest = new InviteRequest(req.body.inviteRequest);
  inviteRequest.save( (err) => {
    if (!err) {
      emailManager.sendInternalAlert("*****New Invite Request Created!", JSON.stringify(inviteRequest, null, 2), emailManager.emailInternalAlertEvents().NEW_INVITE_REQUEST);
      res.send({msg: "Thanks! We'll get back to you shortly! Feel free to get in touch with us build@theHackHive.com" });
    }
  });
};

// Get all request invite.
//app.get('/api/admin/inviteRequests
exports.inviteRequestsGet = function(req, res) {
  InviteRequest.find()
  .exec( (err, inviteRequests) => {
    if (!err && inviteRequests) {
      res.send(inviteRequests);
    } else {
      res.status(404).send({msg: "Errors :(" });
    }
  })
}
