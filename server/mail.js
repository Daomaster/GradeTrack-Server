var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://gradetrack.noreply%40gmail.com:unlv@123@smtp.gmail.com');

var mail = {
  transporter: transporter
}

module.exports = mail;
