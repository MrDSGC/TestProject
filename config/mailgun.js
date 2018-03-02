var nodemailer = require('nodemailer');
var nodemailerMgTransport = require('nodemailer-mailgun-transport');
var AUTH = {
	auth: {
		api_key: 'key-edf2627b4e35da3b49c20f8e616af071',
		domain: 'mail.thehackhive.com'
	}
};
exports.TRANSPORT = nodemailer.createTransport(nodemailerMgTransport(AUTH));
exports.DEFAULT_FROM = "HackHive <Varun@thehackhive.com>";
