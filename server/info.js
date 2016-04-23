var express = require('express');
var router = express.Router();
var mail = require('./mail.js');

router.post('/user', function(req, res, next) {
  res.send("info/user");
});

router.post('/addStudents', function(req, res, next) {
  res.send("info/addStudents");

  mail.transporter.sendMail({
       from: "Gradetrack Team <noreply@gradetrack.com>", // sender address
       to: "Daoyun <daoyun.zeng@gmail.com>", // comma separated list of receivers
       subject: "Class Registration", // Subject line
       text: "Please click the link blow to add this class to your Gradetrack account:",
       html:
       "<b>Signup Confirmation ✔</b><br /><a href='http://localhost:3000/api/grade/exportcsv'>Click Here</a>"
    }, function(error, response){
       if(error){
           console.log(error);
       }else{
           console.log("Message sent: " + response.message);
       }
    });

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
