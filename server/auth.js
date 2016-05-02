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
    type: req.body.type
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
        res.status(500).send('Failed');
      }
    }
    else {
      res.status(500).send('Failed');
    }
  });

  var success = function() {
    res.status(200).send("Success");
  }
});

router.post('/signin', function(req, res, next) {
  // Check if the username exist
  // Not then error out
  // Exists
  // Check if the password matches
  var username = req.body.username;
  var password = req.body.password;
  password = new Buffer(password).toString('base64');
  if (username != null || username != '') {
    config.baseRef.child("users").once("value", function(snapshot) {
      var userExist = snapshot.child(username).exists();
      if (userExist) {
          config.baseRef.child("users"+"/"+username).once("value", function(snapshot) {
            if (password == snapshot.val().password) {
              res.status(200).send("Success");
            }
            else {
              res.status(500).send('Failed');
            }
          });
      }
      else {
        res.status(500).send('Failed');
      }
    });
  }
  else {
    res.status(500).send('Failed');
  }


});

module.exports = router;
