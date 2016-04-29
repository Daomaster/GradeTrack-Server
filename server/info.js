var express = require('express');
var router = express.Router();
var mail = require('./mail.js')
var Firebase = require( 'firebase' );
var async = require( 'async' );
var ref = new Firebase( 'https://grade-track.firebaseio.com/' );

router.post('/user', function(req, res, next) {
  var username = req.query.username;

  ref.child( "users/" + username ).once( "value" ).then( function( userSnapshot ) {
    var user = userSnapshot.val();
    var genError = "Error";

    // Error handling for failure to find user
    if( user == null ) {
      res.send( genError );
    }

    var data = {};

    // Get the basic information from the user account
    data.username = username;
    data.lastName = user.lastName;
    data.firstName = user.firstName;
    data.email = user.email;
    data.schoolId = user.schoolId;

    // If courses is empty then just return now
    if( user.courses == null ) {
      res.send( data );
    }

    // Get the course information
    data.courses = [];
    var generatePromise = function( courseId ) {
      return function( callback ) {
        ref.child( "courses/" + courseId ).once( "value", function( courseSnapshot ){
          var course = courseSnapshot.val();

          // If the user is the course instructor then return everything
          if( course[ "public" ].instructor.id == user.schoolId ) {
            var temp = course[ "public" ];
            temp.students = course[ "private" ];
            temp.courseid = courseId;
            data.courses.push( temp );
            callback( null, null );
          } else {
            var assignments = course[ "public" ].assignments;
            var grades = course[ "private" ][ user.schoolId ].grades;

            for( var key in assignments ) {
              var grade = grades[ key ];
              if( grade != null ) {
                assignments[ key ].grade = grade;
              }
            }
            course[ "public" ].courseid = courseId;
            data.courses.push( course[ "public" ] );
            callback( null, null );
          }
        });
      }
    }

    var promises = [];

    for( var key in user.courses ) {
      promises.push( generatePromise( user.courses[ key ] ) );
    }

    async.parallel( promises, function( err, result ) {
      res.send( data );
    });

  });
});

router.post('/addStudents', function(req, res, next) {
  res.send("info/addStudents");

  var receivers = req.body.students;
  var title = req.body.title;
  var insName = req.body.insName;

  console.log(receivers);

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
