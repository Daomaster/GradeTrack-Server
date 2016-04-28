var nodemailer = require('nodemailer');
var config = require('./config.js');

var transporter = nodemailer.createTransport(config.transporterUrl);

var mail = {
  transporter: transporter
}

module.exports = mail;
