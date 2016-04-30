var express = require('express');
var config = require('./config.js');
var router = express.Router();

/* GET the data from ID. */
router.post('/signup', function(req, res, next) {
  var enEmail = new Buffer(req.body.email).toString('base64');
  var enPwd = new Buffer(req.body.password).toString('base64');
  var username = req.body.username;

  var userInfo = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: enPwd,
    type: req.body.type,
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
