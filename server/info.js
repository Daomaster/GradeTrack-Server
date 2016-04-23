var express = require('express');
var router = express.Router();

router.post('/user', function(req, res, next) {
  res.send("info/user");
});

router.post('/addclass', function(req, res, next) {
  res.send("info/addclass");
});

router.post('/storesyl', function(req, res, next) {
  res.send("info/storesyl");
});

router.post('/getsyl', function(req, res, next) {
  res.send("info/getsyl");
});

module.exports = router;
