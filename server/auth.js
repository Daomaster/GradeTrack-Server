var express = require('express');
var config = require('./config.js');
var router = express.Router();

/* GET the data from ID. */
router.post('/signup', function(req, res, next) {
  var email = req.body.email;
  var pwd = req.body.password;
  var username = req.body.username;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var type = req.body.type;
  var id = req.body.id;

  if( typeof email == 'undefined' || typeof pwd == 'undefined' ||
      typeof firstName == 'undefined' || typeof username == 'undefined' ||
      typeof lastName == 'undefined' || typeof type == 'undefined' ||
      typeof id == 'undefined' ) {
    res.status(500).send('Failed. Must input id, email, password, username, first and last name, and type.');
    return;
  }

  var enEmail = new Buffer(email).toString('base64');
  var enPwd = new Buffer(pwd).toString('base64');

  var userInfo = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: enPwd,
    type: type,
    id : id
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

  if( typeof username == 'undefined' || typeof password == 'undefined' ) {
    res.status(500).send('Failed. Must input username and password.');
    return;
  }

  password = new Buffer(password).toString('base64');
  if (username != null || username != '') {
    config.baseRef.child("users").once("value", function(snapshot) {
      var userExist = snapshot.child(username).exists();
      if (userExist) {
          config.baseRef.child("users"+"/"+username).once("value", function(snapshot) {
            if (password == snapshot.val().password) {
              res.status(200).send(username);
            }
            else {
              res.status(500).send('Failed. Incorrect username or password.');
            }
          });
      }
      else {
        res.status(500).send('Failed. Incorrect username or password.');
      }
    });
  }
  else {
    res.status(500).send('Failed. Username is empty.');
  }


});

module.exports = router;
