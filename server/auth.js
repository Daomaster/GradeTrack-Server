var express = require('express');
var config = require('./config.js');
var router = express.Router();

/* GET the data from ID. */
router.post('/signup', function(req, res, next) {
  // Sample data
  // davism{
  //  email: "davism@mockup.com"
  //  firstName: "Michael",
  //  lastName: "Davis",
  //  password: "davism",
  //  schoolId: "000000025",
  //  schoolIpeds: 1,
  //  type: "instructor"
  //   }
  // Check if the username is registered
  // Check if the email is registered
  // Then push the username to the firebase
  var username = "daoyun";
  var emailAdr = "daoyun@mockup.com";
  var enEmail = new Buffer(emailAdr).toString('base64');
  config.baseRef.child("users").once("value", function(snapshot) {
    var userExist = snapshot.child(username).exists();
    var emailExist = snapshot.child("EnAddr/"+enEmail).exists();
    if (!userExist) {
      if (!emailExist) {
        res.send("Good to go");
      }
      else {
        res.send("User Exists");
      }
    }
    else {
      res.send("User Exists");
    }
  });



});

router.post('/signin', function(req, res, next) {
  res.send("auth/signin");
});

module.exports = router;
