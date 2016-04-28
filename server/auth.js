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

  config.baseRef.child("users").on("value", function(snapshot) {
    var b = snapshot.child("davism").exists();
    if (b) {
      res.send("User exists");
    }
    else {
      res.send("Good to go");
    }

  });


});

router.post('/signin', function(req, res, next) {
  res.send("auth/signin");
});

module.exports = router;
