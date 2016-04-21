var express = require('express');
var router = express.Router();

/* GET the data from ID. */
router.post('/signup', function(req, res, next) {
  res.send("auth/signup");
});

router.post('/signin', function(req, res, next) {
  res.send("auth/signip");
});

module.exports = router;
