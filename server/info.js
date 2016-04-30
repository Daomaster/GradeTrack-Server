var express = require('express');
var router = express.Router();
var mail = require('./mail.js')
var Firebase = require( 'firebase' );
var async = require( 'async' );
var config = require('./config.js');
var ref = config.baseRef;

router.post('/user', function(req, res, next) {
  var username = req.query.username;

  ref.child( "users/" + username ).once( "value" ).then( function( userSnapshot ) {
    var user = userSnapshot.val();

    // Error handling for failure to find user
    if( user == null ) {
      res.status( 500 ).send( "Failure" );
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
      res.status( 200 ).send( data );
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
      res.status( 200 ).send( data );
    });

  });
});

router.post('/addStudents', function(req, res, next) {
  res.status( 200 ).send("info/addStudents");

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

router.post('/addassign', function(req, res, next) {
  var courseId = req.query.courseid;
  var title = req.query.title;
  var description = req.query.description;
  var total = req.query.total;
  var due = req.query.due;

  if( typeof courseId  == 'undefined' || typeof title == 'undefined' ||
      typeof description  == 'undefined' || typeof total  == 'undefined' ) {
    res.status( 500 ).send( "Failure. Post requires courseid, title, description, total" );
    return;
  }

  var courseRef = ref.child( "courses/" + courseId );
  courseRef.once( "value" ).then( function( snapshot ) {
    var course = snapshot.val();
    if( course == null ) {
      res.status( 500 ).send( "Failure. Course was not found." );
      return;
    } else {
      // Check if the total is a number
      if( isNaN( total ) ) {
        res.status( 500 ).send( "Failure. Assignment total must be a number." );
        return;
      }

      // Check that the assignment is unique
      var assignments = course[ "public" ].assignments;
      title = title.trim();
      for( var key in assignments ) {
        if( assignments[ key ].title.toUpperCase() == title.toUpperCase() ) {
          res.status( 500 ).send( "Failure. Assignment title must be unique." );
          return;
        }
      }
      var assignment = { title : title, description : description, total : total };
      // Get the due date
      if( typeof due != 'undefined' && Object.keys( due ).length !== 0 ) {
        temp = {};
        due = JSON.parse( due );
        for( var key in due ) {
          switch( key.toLowerCase() ) {
            case 'year':
            case 'month':
            case 'day':
            case 'hour':
            case 'minute':
            case 'second':
              temp[ key ] = due[ key ];
              break;
            default:
              break;
          }
        }
        assignment.due = temp;
      }

      courseRef.child( "public/assignments" ).push( assignment );
      res.status( 200 ).send( "Success" );
    }
  });
});

router.post('/addclass', function(req, res, next) {
  res.status( 200 ).send("info/addclass");
});

router.post('/storesyl', function(req, res, next) {
  res.status( 200 ).send("info/storesyl");
});

router.post('/getsyl', function(req, res, next) {
  res.status( 200 ).send("info/getsyl");
});

module.exports = router;
