var firebase = require('firebase');
var firebaseUrl = 'https://grade-track.firebaseio.com/';
var baseRef = new Firebase(firebaseUrl);

var config = {
  transporterUrl: 'smtps://gradetrack.noreply%40gmail.com:unlv@123@smtp.gmail.com',
  baseRef: baseRef
}

module.exports = config;
