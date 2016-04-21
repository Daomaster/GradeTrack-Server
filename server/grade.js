var express = require('express');
var router = express.Router();

/* GET the data from ID. */
router.post('/update', function(req, res, next) {
  res.send("grade/update");
});

router.post('/importcsv', function(req, res, next) {
  res.send("grade/importcsv");
});

router.post('/exportcsv', function(req, res, next) {
  res.send("grade/exportcsv");
});

module.exports = router;
