var express = require('express');
var router = express.Router();
require( 'firebase' );
require( 'async' );
var config = require('./config.js');

var Field = Object.freeze( {
  FirstName : "FirstName",
  LastName : "LastName",
  UserName : "UserName",
  Id : "Id",
  LastAccess : "LastAccess",
  Availability : "Availability",
  WeightedTotal : "WeightedTotal",
  Total : "Total",
  Assignment : "Assignment",
  Grade : "Grade",
  Blank : "Blank"
} );

router.post('/update', function(req, res, next) {
  var courseId = req.body.courseid;
  var assignmentId = req.body.assignmentid;
  var students = req.body.students;

  if( typeof courseId == 'undefined' || typeof assignmentId == 'undefined' ||
      typeof students == 'undefined' ) {
    res.status( 500 ).send( "Failure. Course and assignment ids must be given and students be listed" );
    return;
  }

  var courseRef = config.baseRef.child( "courses/" + courseId );

  courseRef.once( "value" ).then( function( snapshot ) {
    var course = snapshot.val();

    // Checks if the course exists
    if( course == null ) {
      res.status( 500 ).send( "Failure. Invalid course id." );
      return;
    }
    // Checks if the assignment exists
    var assignment;
    if( assignmentId in course[ "public" ].assignments ) {
      assignment = course[ "public" ].assignments[ assignmentId ];
    } else {
      res.status( 500 ).send( "Failure. Invalid assignment id." );
      return;
    }

    // Check if student exists
    for( var iter = 0, length = students.length; iter < length; ++iter ) {
      if( !( students[ iter ].studentid in course[ "private" ] ) ) {
        res.status( 500 ).send( "Failure. Invalid student id." );
        return;
      }
    }

    var update = {};
    var earnedChange = 0;
    var totalChange = 0;

    for( var iter = 0, len = students.length; iter < len; ++iter ) {
      var studentId = students[ iter ].studentid;
      var grade = students[ iter ].grade;
      var student = course[ "private" ][ studentId ];
      //var studentRef = courseRef.child( "private/" + studentId );
      var studentDir = "private/" + studentId;

      // Gets the assignments oldvalue
      var oldGrade;
      if( typeof student.grades != 'undefined' && assignmentId in student.grades ) {
          oldGrade = student.grades[ assignmentId ];
      }

      // Text to text
      if( isNaN( grade ) && isNaN( oldGrade ) ) {
        update[ studentDir + "/grades/" + assignmentId ] = grade;
      // Grade added
      } else if( !isNaN( grade ) && isNaN( oldGrade ) ) {
        var earned = parseInt( grade ) + parseInt( student.earned );
        var total = parseInt( assignment.maxPoint ) + parseInt( student.total );

        update[ studentDir + "/grades/" + assignmentId ] = grade;
        update[ studentDir + "/earned" ] = earned;
        update[ studentDir + "/total" ] = total;

        earnedChange += parseInt( grade );
        totalChange += parseInt( assignment.maxPoint );
      // Grade removed
      } else if( isNaN( grade ) && !isNaN( oldGrade ) ) {
        // Remove the old grade
        var total = parseInt( student.total ) - parseInt( assignment.maxPoint );
        var earned = parseInt( student.earned ) - parseInt( oldGrade );

        update[ studentDir + "/grades/" + assignmentId ] = grade;
        update[ studentDir + "/earned" ] = earned;
        update[ studentDir + "/total" ] = total;

        earnedChange -= oldGrade;
        totalChange -= parseInt( assignment.maxPoint );
      // Grade changed
      } else {
        var earned = parseInt( student.earned ) - parseInt( oldGrade ) + parseInt( grade );

        update[ studentDir + "/grades/" + assignmentId ] = grade;
        update[ studentDir + "/earned" ] = earned;

        earnedChange += grade - oldGrade;
      }
    }

    var assignmentDir = "public/assignments/" + assignmentId;
    update[ assignmentDir + "/earned" ] = parseInt( assignment.earned ) + earnedChange;
    update[ assignmentDir + "/total" ] = parseInt( assignment.total ) + totalChange;
    update[ "public/earned" ] = parseInt( course[ "public" ].earned ) + earnedChange;
    update[ "public/total" ] = parseInt( course[ "public" ].total ) + totalChange;
    courseRef.update( update );

    res.status( 200 ).send( "Success." );
  });
});

router.post('/importcsv', function(req, res, next) {
  
  var courseId = req.body.courseid;
  var csv = req.body.csv;

  if( typeof courseId == 'undefined' || typeof csv == 'undefined' ) {
    res.status( 500 ).send( "Failure. Course and csv must be given." );
    return;
  }
  
  var courseRef = config.baseRef.child( "courses/" + courseId );
  
  var getDbCourseJson = function( courseId ) {
    return courseRef.once( "value" ).then( function( snapshot ){ 
      if( snapshot.val() == null ) {
        return undefined;
      } else {
        return snapshot.val();
      }
    });
  }
  
  var getCsvArray = function( csv ) {
    csv = csv.split( "\n" );
    for( var row = 0; row < csv.length; ++row ) {
      csv[ row ] = csv[ row ].split( "," );
      for( var col = 0; col < csv[ row ].length; ++col ) {
        csv[ row ][ col ] = csv[ row ][ col ].trim();
      }
    }
    return csv;
  }
  
var getType = function( cell ) {
  var type = 0;

  cell = cell.trim( " " ).toLowerCase();
  if( cell.length == 0 ) {
    type = Field.Blank;
  } else if( cell.length == 1 && cell[ 0 ] == '.' ) {
    type = 0;
  } else if( RegExp( /^-?\d*\.?\d*$/ ).test( cell ) ) {
    type = Field.Grade;
  } else if( RegExp( /^last(\s+(names?|!access))?$/ ).test( cell ) ) {
    type = Field.LastName;
  } else if( RegExp( /^first(\s+names?)?$/ ).test( cell ) ) {
    type = Field.FirstName;
  } else if( RegExp( /^user(\s*(name))?s?$/ ).test( cell ) ) {
    type = Field.UserName;
  } else if( RegExp( /^((student)?s?\s+ids?|ids?)$/ ).test( cell ) ) {
    type = Field.Id;
  } else if( RegExp( /^last(\s+(!name|access))?$/ ).test( cell ) ) {
    type = Field.LastAccess;
  } else if( RegExp( /^availability$/ ).test( cell ) ) {
    type = Field.Availability;
  } else if( RegExp( /^weighted\s+total/ ).test( cell ) ) {
    type = Field.WeightedTotal;
  } else if( RegExp( /^total/ ).test( cell ) ) {
    type = Field.Total;
  }

  return type;
}
  
  // Reasons for rejection
  // Unheaded cell
  // missing students from course
  // missing assignments from course
  // extra students in course
  // extra assignments in course
  // header doesn't have id (key) field
  // any student is missing their id field
  // id fields are not unique
  var isValidCsv = function( courseJson, courseArray ) {
    var header = courseArray[ 0 ].slice();
    var ids = [];
    var idCol;
    var hasId = false;

    // Check that the header contains only regonized field (must include an id
    // field) and regonized assignment titles
    for( var col = 0; col < header.length; ++col ) {
      switch( getType( header[ col ] ) ) {
        case Field.FirstName:
            header[ col ] = { "type" : Field.FirstName };
          break;
        case Field.LastName:
            header[ col ] = { "type" : Field.LastName };
          break;
        case Field.Id:
            header[ col ] = { "type" : Field.Id };
            idCol = col;
            hasId = true;
          break;
        case Field.LastAccess:
            header[ col ] = { "type" : Field.LastAccess };
          break;
        case Field.Availability:
            header[ col ] = { "type" : Field.Availability };
          break;
        case Field.WeightedTotal:
            header[ col ] = { "type" : Field.WeightedTotal };
          break;
        case Field.Total:
            header[ col ] = { "type" : Field.Total };
          break;
        case Field.Blank:
            header[ col ] = { "type" : Field.Blank };
          break;
        default:
          var assignments = courseJson[ "public" ].assignments;
          var title = header[ col ].toUpperCase();
          for( var key in assignments ) {
            header[ col ] = { type : Field.Assignment };
            if( assignments[ key ].title.toUpperCase() === title ) {
              header[ col ].key = key;
              break;
            }
          }
          break;
      }
    }

    if( !hasId ) {
      return { valid : false, error : "There must be a id field in the header" };
    }

    var col = 0;
    for( var col = 0; col < header.length; ++col ) {
      if( header[ col ].type == Field.Assignment && header[ col ].key == undefined ) {
          return { valid : false, error : "Unregonized assignment \'" + courseArray[ 0 ][ col ] + "\' at column " + col + "." };
      }
    }

    // Check if no rows have dangling cells and that every row has an unique 
    // and valid id
    var courseIds = Object.keys( courseJson[ "private" ] );
    for( var row = 1; row < courseArray.length; ++row ) {
      if( courseArray[ row ].length > header.length ) {
        return { valid : false, error : "Row " + row + " had unheaded cell(s)." };
      }
      var id = courseArray[ row ][ idCol ];
      if( Array.prototype.indexOf.call( courseIds, id ) == -1 ) {
        return { valid : false, error : "Student id " + id + " not found in course." };
      }
      if( Array.prototype.indexOf.call( ids, id ) == -1 ) {
        ids.push( id );
      } else {
        return { valid : false, error : "Student id " + id + " was found twice." };
      }
    }

    return { "valid" : true, "header" : header, "ids" : ids };
  }

  var updateDatabase = function( course, csvArray, header, ids ) {
    csvFormat = { header : header, ids : ids, notes : {} };
    var assignments = course[ "public" ].assignments;

    var assignEarned = {};
    var assignTotal = {};
    for( var col = 0; col < header.length; ++col ) {
      if( header[ col ].type == Field.Assignment ) {
        assignEarned[ header[ col ].key ] = 0;
        assignTotal[ header[ col ].key ] = 0;
      }
    }

    for( var row = 1; row < csvArray.length; ++row ) {
      var studentEarned = 0;
      var studentTotal = 0;
      var grades = {}
      var id = ids[ row - 1 ];
      var student = csvArray[ row ];
      csvFormat.notes[ id ] = {};

      for( var col = 0; col < student.length; ++col ) {
        switch( header[ col ].type ) {
          case Field.Id:
          case Field.FirstName:
          case Field.LastName:
          case Field.UserName:
            break;
          case Field.LastAccess:
          case Field.Availability:
          case Field.WeightedTotal:
          case Field.Total:
          case Field.Availability:
          case Field.Blank:
            csvFormat.notes[ id ][ col ] = student[ col ];
            break;
          case Field.Assignment:
            // If it is an number
            if( !isNaN( student[ col ] ) ) {
              if( student[ col ] != "" ) {
                var assignment = header[ col ].key;
                grades[ assignment ] = parseInt( student[ col ] );
                studentEarned += parseInt( student[ col ] );
                studentTotal += parseInt( assignments[ assignment ].maxPoint );
                assignEarned[ assignment ] += parseInt( student[ col ] );
                assignTotal[ assignment ] += parseInt( assignments[ assignment ].maxPoint );
              }
            }
            break;
        }
      }
      courseRef.child( "private/" + id + "/grades" ).set( grades );
      courseRef.child( "private/" + id + "/earned" ).set( parseInt( studentEarned ) );
      courseRef.child( "private/" + id + "/total" ).set( parseInt( studentTotal ) );
    }

    var courseEarned = 0;
    var courseTotal = 0;
    for( var col = 0; col < header.length; ++col ) {
      if( header[ col ].type == Field.Assignment ) {
        var key = header[ col ].key;
        courseEarned += assignEarned[ key ];
        courseTotal += assignTotal[ key ];
        courseRef.child( "public/assignments/" + key + "/earned" ).set( assignEarned[ key ] );
        courseRef.child( "public/assignments/" + key + "/total" ).set( assignTotal[ key ] );
      }
    }

    courseRef.child( "public/earned" ).set( courseEarned );
    courseRef.child( "public/total" ).set( courseTotal );

    courseRef.child( "csvFormat" ).set( csvFormat );
  }

  getDbCourseJson( courseId ).then( function( course ){ 
    if( course === undefined ) {
      res.status( 500 ).send( "Course does not exist" );
      return;
    }

    csvArray = getCsvArray( csv );
    validCsv = isValidCsv( course, csvArray );
    if( validCsv.valid == false ) {
      res.status( 500 ).send( validCsv.error );
      return;
    } else {
      updateDatabase( course, csvArray, validCsv.header, validCsv.ids );
      res.status( 200 ).send( "success" );
    }
  });
  
});

router.post('/exportcsv', function(req, res, next) {
  res.status( 200 ).send("grade/exportcsv");
});

module.exports = router;

