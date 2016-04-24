var express = require('express');
var router = express.Router();
var mail = require('./mail.js');

router.post('/user', function(req, res, next) {
  res.send("info/user");
});

router.post('/addStudents', function(req, res, next) {
  res.send("info/addStudents");

  var receivers = ["daoyun.zeng@gmail.com","stenen@unlv.nevada.edu"];
  var title = "CS 135";
  var insName = "Lee Mishe";

  mail.transporter.sendMail({
       from: "Gradetrack Team <noreply@gradetrack.com>",
       bcc: receivers,
       subject: title + " Registration",
       html:
       "<b>Signup Confirmation</b><br /><br /><p>Your teacher "+insName+" invite your to join "+title+" :</p><br /><a href='http://localhost:3000/api/grade/exportcsv'>Click Here</a><br />"
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
