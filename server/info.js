var express = require('express');
var router = express.Router();
var mail = require('./mail.js')
var Firebase = require( 'firebase' );
var async = require( 'async' );
var config = require('./config.js');

router.post('/user', function(req, res, next) {
  var username = req.query.username;

  if( typeof username == 'undefined' ) {
    res.status( 500 ).send( "Failure. Username must be supplied." );
  }

  config.baseRef.child( "users/" + username ).once( "value" ).then( function( userSnapshot ) {
    var user = userSnapshot.val();

    // Error handling for failure to find user
    if( user == null ) {
      res.status( 500 ).send( "Failure. User not found." );
    }

    var data = {};

    // Get the basic information from the user account
    data.username = username;
    data.lastName = user.lastName;
    data.firstName = user.firstName;
    data.email = user.email;
    data.id = user.id;

    // If courses is empty then just return now
    if( user.courses == null ) {
      res.status( 200 ).send( data );
      return;
    }

    // Get the course information
    data.courses = [];
    var generatePromise = function( courseId ) {
      return function( callback ) {
        config.baseRef.child( "courses/" + courseId ).once( "value", function( courseSnapshot ){
          var course = courseSnapshot.val();

          // If the user is the course instructor then return everything
          if( course[ "public" ].instructor.id == user.id ) {
console.log( "instructor" );
            var temp = course[ "public" ];
            temp.students = course[ "private" ];
            temp.courseid = courseId;
            data.courses.push( temp );
            callback( null, null );
          } else {
console.log( "student" );
            var assignments = course[ "public" ].assignments;
            var grades = course[ "private" ][ user.id ].grades;

            if( typeof grades != 'undefined' ){
              for( var key in assignments ) {
                var grade = grades[ key ];
                if( grade != null ) {
                  assignments[ key ].grade = grade;
                }
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
console.log( user.courses[ key ].title );
      promises.push( generatePromise( user.courses[ key ].courseId ) );
    }

    async.series( promises, function( err, result ) {
      res.status( 200 ).send( data );
    });

  });
});

router.post('/addstudents', function(req, res, next) {
  var emails = req.query.emails;
  var courseId = req.query.courseid;

  if( typeof emails  == 'undefined' || typeof courseId == 'undefined' ) {
    res.status( 500 ).send( "Failure. /addstudents api requires list of student emails and a course" );
    return;
  }
  
  var courseRef = config.baseRef.child( "courses/" + courseId );
  courseRef.once( "value" ).then( function( snapshot ) {
    var course = snapshot.val();
    if( course == null ) {
      throw "Failure: Course not found.";
    }

    if( typeof course.pending == 'undefined' ) {
      for( var iter = 0, len = emails.length; iter < len; ++iter ) {
        var email64 = new Buffer( emails[ iter ] ).toString('base64');
        courseRef.child( "pending/" + email64 ).set( false );
      }
  
      // I broke it I'm sorry
      /*mail.transporter.sendMail({
           from: "Gradetrack Team <noreply@gradetrack.com>",
           bcc: emails,
           subject: title + " Registration",
           html:"testing"
           "<b>Signup Confirmation</b><br /><br /><p>Your teacher "+course[ "public" ].instructor.firstName+" "+course[ "public" ].instructor.lastName+" invite your to join "++course[ "public" ].title+" :</p><br /><a href='http://localhost:3000/api/grade/exportcsv'>Click Here</a><br />"
        }, function(error, response){
           if(error){
               console.log(error);
           }else{
               console.log("Message sent: " + response.message);
           }
        });*/
    } else {
      for( var iter = 0, len = emails.length; iter < len; ++iter ) {
        var email64 = new Buffer( emails[ iter ] ).toString('base64');
        if( !( email64 in course.pending ) ) {
          courseRef.child( "pending/" + email64 ).set( false );
        }
      }
    }
    res.status( 200 ).send( "Success" );
  }).catch( function( e ){
    res.status( 500 ).send( e );
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

  var courseRef = config.baseRef.child( "courses/" + courseId );
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
      var assignment = { earned : 0, total : 0, title : title, description : description, maxPoint : total };
      // Get the due date
      if( typeof due != 'undefined' && Object.keys( due ).length !== 0 ) {
        due = JSON.parse( due );
        temp = {};
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

      var assignmentId = courseRef.child( "public/assignments" ).push( assignment );
      res.status( 200 ).send( assignmentId.key() );
    }
  });
});

router.post('/addcourse', function(req, res, next) {
  var username = req.query.username;
  var title = req.query.title;
  var description = req.query.description;

  if( typeof username == 'undefined' || typeof title == 'undefined' || 
      typeof description == 'undefined' ) {
    res.status( 500 ).send( "Failure: Requires username, title, and description" );
    return;
  }

  config.baseRef.child( "users/" + username ).once( "value" ).then( function( snapshot ){
    var instructor = snapshot.val();
    if( instructor == null ) {
      throw "Failure: User not found";
    }

    return config.baseRef.child( "courses" ).push( {
      "public" : {
        earned : 0,
        total : 0,
        title: title,
        description: description,
        instructor: {
          id : instructor.id,
          email : instructor.email,
          firstName : instructor.firstName,
          lastName : instructor.lastName
        }
      }
    }).then( function( courseId ){
      config.baseRef.child( "users/" + username ).child( "courses" ).push({
        courseId : courseId.key(),
        title : title
      });
      res.status( 200 ).send( courseId.key() );
    });
  }).catch( function( e ) {
    res.status( 500 ).send( e );
  });

});

router.get('/enrollstudent', function(req, res, next) {
  var courseId = req.query.courseid;
  var username = req.query.username;
  var user;
  var course;
  // call sign-in
  // if failure sign-up
  // get user email

  var courseRef = config.baseRef.child( "courses/" + courseId );
  var userRef = config.baseRef.child( "users/" + username );


  userRef.once( "value" ).then( function( userSnapshot ) {
    user = userSnapshot.val();
    if( user == null ) {
      throw "Failure. User not found.";
    }
  }).then( function() {
    courseRef.once( "value" ).then( function( courseSnapshot ) {
      course = courseSnapshot.val();
      if( course == null ) {
        throw "Failure. Course not found.";
      }
    }).then( function() {
      var email = new Buffer( user.email ).toString('base64');
      if( email in course.pending ) {
        if( course.pending[ email ] == true ) {
          res.status( 500 ).send( "Failure: User is already enrolled in course" );
        } else {
          courseRef.child( "pending/" + email ).set( true );

          var student = {};

          if( typeof course[ "public" ].students == 'undefined' ) {
            courseRef.child( "public/students/0" ).update( {
              firstName : user.firstName,
              lastName : user.lastName
            });
          } else {
            courseRef.child( "public/students/" + course[ "public" ].students.length ).update( {
              firstName : user.firstName,
              lastName : user.lastName
            });
          }

          courseRef.child( "private/" + user.id ).update({
            email : user.email,
            id : user.id,
            firstName : user.firstName,
            lastName : user.lastName,
            earned : 0,
            total : 0
          });

          userRef.child( "courses" ).push({
            courseId : courseId,
            title : course[ "public" ].title
          });

          res.status( 200 ).send( "added" );
        }
      } else {
        res.status( 500 ).send( "Failure: User not able to register for course." );
      }
    }).catch( function( e ) {
      res.status( 500 ).send( e );
    });
  }).catch( function( e ){
    res.status( 500 ).send( e );
  });
});

router.post('/storesyl', function(req, res, next) {
  res.status( 200 ).send("info/storesyl");
});

router.post('/getsyl', function(req, res, next) {
  res.status( 200 ).send("info/getsyl");
});

module.exports = router;
