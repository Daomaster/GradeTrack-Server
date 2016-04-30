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
  var userType = "student";
  var userId = "1000000099";
  var fName = "Daoyun";
  var lName = "Zeng";
  var pwd = "unlv@123"
  var enPwd = new Buffer(pwd).toString('base64');

  var userInfo = {
    email: emailAdr,
    firstName: fName,
    lastName: lName,
    password: enPwd,
    type: userType,
    courses:{

    }
  };

  config.baseRef.child("users").once("value", function(snapshot) {
    var userExist = snapshot.child(username).exists();
    var emailExist = snapshot.child("EnAddr/"+enEmail).exists();
    if (!userExist) {
      if (!emailExist) {
        config.baseRef.child("users").child(username).set(userInfo);
        config.baseRef.child("users/EnAddr").child(enEmail).set(username,success);
      }
      else {
        res.send("Failed: User Exists");
      }
    }
    else {
      res.send("Failed: User Exists");
    }
  });

  var success = function() {
    res.send("Success");
  }



});

router.post('/signin', function(req, res, next) {
  res.send("auth/signin");
});

module.exports = router;
