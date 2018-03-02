var async = require('async');
var crypto = require('crypto');
var mailgun = require('../config/mailgun');
var nodemailer = require('nodemailer');
var nodemailerMgTransport = require('nodemailer-mailgun-transport');

const User = require('../models/User');
const UserFollowObject = require('../models/UserFollowObject');
const FollowHelper = require('./followHelper');

var TRANSPORT = mailgun.TRANSPORT;
var FROM_FRIEND = mailgun.DEFAULT_FROM;

var emailInternalAlertEvents = () => {
	return {
		PROFILE_UPDATE: "PROFILE_UPDATE",
		NEW_INVITE_REQUEST: "NEW_INVITE_REQUEST",
		PROJECT_UPDATE: "PROJECT_UPDATE",
		NEW_USER_FOLLOW_EVENT: "NEW_USER_FOLLOW_EVENT",
		NEW_COLLAB_INVITE: "NEW_COLLAB_INVITE",
		COLLAB_INVITE_ACCEPTED: "COLLAB_INVITE_ACCEPTED",
		NEW_PROJECT_CREATED: "NEW_PROJECT_CREATED",
		NEW_USER_SIGN_UP: "NEW_USER_SIGN_UP",
		SIGN_UP_INVITE_CODE_CLAIMED: "SIGN_UP_INVITE_CODE_CLAIMED",
		SUBSCRIBE_ADDED: "SUBSCRIBE_ADDED",
		SUBSCRIBE_CREATED_WAITING_EMAIL_CONFIRM: "SUBSCRIBE_CREATED_WAITING_EMAIL_CONFIRM",
		VOTE_CREATED_AND_COUNTED: "VOTE_CREATED_AND_COUNTED",
		VOTE_CREATED_WAITING_EMAIL_CONFIRM: "VOTE_CREATED_WAITING_EMAIL_CONFIRM",
		VOTE_CLAIMED_EMAIL_CONFIRM: "VOTE_CLAIMED_EMAIL_CONFIRMED"
	}
}

exports.emailInternalAlertEvents = emailInternalAlertEvents;

exports.sendInternalAlert = function(subject, message, eventName) {
	// send an alert to all admins, with the eventName
	User.find({
		isAdmin: true,
		$or:[
			{emailAlertEventSubscriptions: emailInternalAlertEvents()[eventName]},
			{emailAlertEventSubscriptions: 'ALL'}
		],
		emailNOTAlertEventSubscriptions: {
			$nin:[
				emailInternalAlertEvents()[eventName],
				'ALL'
			]
		}
	})
	.exec( (err, adminUsers) => {
		var messageToEmail = ""
		if (typeof message != "string") {
			messageToEmail = JSON.stringify(message, null, 2)
		} else {
			messageToEmail = message;
		}
		if (!err && adminUsers.length) {
			adminUsers.map( (adminUser) => {
				var emailAddressToAlert = adminUser.email;

				if(adminUser.adminEmailAddress) {
					emailAddressToAlert = adminUser.adminEmailAddress;
				}

				TRANSPORT.sendMail({
					to: emailAddressToAlert,
					from: FROM_FRIEND,
					subject: '[ALERT]' + eventName + " : " + subject,
					text: messageToEmail,
					'o:tag':'internal-alert'
				});
			})
		}
	})
};

exports.sendWelcomeEmail = function(user, req, res) {
	res.render(
		'email/WelcomeEmail',
		{
			layout: null,
			user: user
		},
		function(err, html) {
			var mailOptions = {
				to: user.email,
				from: mailgun.DEFAULT_FROM,
				subject: 'Welcome to HackHive',
				html: html,
				'o:tag':'welcome-email-after-profile-update'
			};
			TRANSPORT.sendMail(mailOptions);
		});
}

exports.sendNewProjectEmail = function(user, project, req, res) {
	res.render(
		'email/NewProjectEmail',
		{
			layout: null,
			user,
			project
		},
		function(err, html) {
			var mailOptions = {
				to: user.email,
				from: mailgun.DEFAULT_FROM,
				subject: 'Your HackHive Project: ' + project.title,
				html: html,
				'o:tag':'welcome-email-after-profile-update'
			};
			TRANSPORT.sendMail(mailOptions);
		});
}

// Ensure Project and invitor is populated in projectInvite object
exports.sendProjectInviteEmail = function(projectInvite, req, res) {
	res.render(
		'email/newInviteEmail',
		{
			layout: null,
			projectInvite,
			project: projectInvite.project
		},
		function(err, html) {
			var mailOptions = {
				to: projectInvite.inviteEmailAddress,
				from: mailgun.DEFAULT_FROM,
				subject: 'Join: ' + projectInvite.project.title,
				html: html,
				'o:tag':'invite-project-sent'
			};
			TRANSPORT.sendMail(mailOptions);
		}
	);
}

// Ensure Project and invitor is populated in projectInvite object
exports.sendInviteAcceptToInvitorEmail = function(projectInvite, userThatAcceptedInvite, req, res) {
	res.render(
		'email/inviteAcceptEmail',
		{
			layout: null,
			projectInvite,
			invitor: projectInvite.invitor,
			project: projectInvite.project,
			userThatAcceptedInvite
		},
		function(err, html) {
			var mailOptions = {
				to: projectInvite.invitor.email,
				from: mailgun.DEFAULT_FROM,
				subject: 'Your Invite to ' + projectInvite.project.title + ' has been accepted!',
				html: html,
				'o:tag':'invite-accept-notification'
			};
			TRANSPORT.sendMail(mailOptions);
		}
	);
}

// Ensure Project is populated
exports.sendEmailToConfirmVote = function(voteObject, req, res) {
	var verifyEmailUrl = "https://" + req.header('host') + '/verifyEmailToVote/' + voteObject.verifyEmailToken;

	res.render(
		'email/confirmVoteEmail',
		{
			layout: null,
			voteObject,
			verifyEmailUrl
		},
		function(err, html) {
			var mailOptions = {
				to: voteObject.emailAddress,
				from: mailgun.DEFAULT_FROM,
				subject: 'Please confirm email address to vote on: ' + voteObject.project.title,
				html: html,
				'o:tag':'vote-confirm-email'
			};
			TRANSPORT.sendMail(mailOptions);
		}
	);
}

// Send email to project owners about new votes
exports.newVoteNotificationsToProjectOwners = function(project, usersToEmailArray, req, res) {
	var projectUrl = "https://" + req.header('host') + '/project/' + project.slug;

	usersToEmailArray.map( (userToEmail) => {
		if (userToEmail.email) {
			res.render(
				'email/newVoteNotification',
				{
					layout: null,
					project,
					userToEmail,
					projectUrl
				},
				function(err, html) {
					var mailOptions = {
						to: userToEmail.email,
						from: mailgun.DEFAULT_FROM,
						subject:  project.title + ' got another vote!',
						html: html,
						'o:tag':'new-vote-notification-email'
					};
					TRANSPORT.sendMail(mailOptions);
				}
			);
		}
	});
}

// Send email to person being followed about a new follow notification
exports.newFollowNotificationToUserBeingFollowed = function(userFollowObject, req, res) {

	UserFollowObject.findById(userFollowObject._id)
  .populate([
    'followerUser',
    'toFollowUser'
  ])
  .exec( (err, userFollowObject) => {
		var userBeingFollowed = userFollowObject.toFollowUser;
		var userDoingFollowing = userFollowObject.followerUser;

		if (userFollowObject && userBeingFollowed && userDoingFollowing) {

			// check if the reverse relationship exists, if the user being followed follows the user doing the following
			FollowHelper.checkFollowUserFollowStatus(userBeingFollowed, userDoingFollowing, (followStatus) => {
				// followStatus == true means user being followed already follows the original user.s
				var showFollowBackMessage = !followStatus; // works the opposite of the check. if true, don't show the followback message.

				res.render(
					'email/newFollowNotificationToUserBeingFollowed',
					{
						layout: null,
						userBeingFollowed,
						userDoingFollowing,
						userDoingFollowingProlifeLink: userDoingFollowing.getUserProductionURL(),

						// show follow back message
						showFollowBackMessage
					},
					function(err, html) {
						var mailOptions = {
							to: userBeingFollowed.email,
							from: mailgun.DEFAULT_FROM,
							subject: userBeingFollowed.firstName + ' you have a new follower!',
							html: html,
							'o:tag':'new-follow-notification-email-to-follower'
						};
						TRANSPORT.sendMail(mailOptions);
					}
				);
			});
		}
	});
}
