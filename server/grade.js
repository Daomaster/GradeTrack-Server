var express = require('express');
var router = express.Router();
require( 'firebase' );
require( 'async' );
var ref = new Firebase( "https://grade-track.firebaseio.com/" );

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

/* GET the data from ID. */
router.post('/update', function(req, res, next) {
  var courseId = req.query.courseid;
  var assignmentId = req.query.assignmentid;
  var studentId = req.query.studentid;
  var data = req.query.data;

  var courseRef = ref.child( "courses/" + courseId );
  courseRef.once( "value" ).then( function( snapshot ) {
    var course = snapshot.val();

    // Checks if the course exists
    if( course == null ) {
      res.status( 500 ).send( "invalid courseid" );
    }

    // Check if student exists
    var student;
    if( studentId in course[ "private" ] ) {
      student = course[ "private" ][ studentId ];
    } else {
      res.status( 500 ).send( "invalid studentid" );
    }

    // Checks if the assignment exists
    var assignment;
    if( assignmentId in course[ "public" ].assignments ) {
      assignment = course[ "public" ].assignments[ assignmentId ];
    } else {
      res.status( 500 ).send( "invalid assignmentid" );
    }

    // Gets the assignments oldvalue
    var oldGrade;
    if( assignmentId in student.grades ) {
        oldGrade = student.grades[ assignmentId ];
    }

    // If it is not a number
    if( isNaN( data ) ) {
      // Find assignments index in csvFormat
      var csvFormat = course.csvFormat;
      var header = csvFormat.header;
      for( var col = 0; col < header.length; ++col ) {
        if( header[ col ].type == Field.Assignment && header[ col ].key == assignmentId ) {
          courseRef.child( "csvFormat/notes/" + studentId + "/" + col ).set( data );
          break;
        }
      }
      // Update the csv
      if( !isNaN( oldGrade ) ) {
        courseRef.child( "private/" + studentId + "/grades/" + assignmentId ).set( null );
        var difference = parseInt( oldGrade );
        courseRef.child( "private/" + studentId + "/total" ).set( parseInt( course[ "private" ][ studentId ].total ) - parseInt( course[ "public" ].assignments[ assignmentId ].maxPoint ) );
        courseRef.child( "public/assignments/" + assignmentId + "/total" ).set( parseInt( course[ "public" ].assignments[ assignmentId ].total ) - parseInt( course[ "public" ].assignments[ assignmentId ].maxPoint ) );
        courseRef.child( "public/total" ).set( parseInt( course[ "public" ].total ) - parseInt( course[ "public" ].assignments[ assignmentId ].maxPoint ) );
        courseRef.child( "private/" + studentId + "/earned" ).set( parseInt( course[ "private" ][ studentId ].earned ) - difference );
        courseRef.child( "public/assignments/" + assignmentId + "/earned" ).set( parseInt( course[ "public" ].assignments[ assignmentId ].earned ) - difference );
        courseRef.child( "public/earned" ).set( parseInt( course[ "public" ].earned ) - difference );
      }
    } else {
      if( isNaN( oldGrade ) ) {
        // Find assignments index in csvFormat
        var csvFormat = course.csvFormat;
        var header = csvFormat.header;
        for( var col = 0; col < header.length; ++col ) {
          if( header[ col ].type == Field.Assignment && header[ col ].key == assignmentId ) {
            courseRef.child( "csvFormat/notes/" + studentId + "/" + col ).set( null );
            break;
          }
        }
        oldGrade = 0;
        courseRef.child( "private/" + studentId + "/total" ).set( parseInt( course[ "private" ][ studentId ].total ) + parseInt( course[ "public" ].assignments[ assignmentId ].maxPoint ) );
        courseRef.child( "public/assignments/" + assignmentId + "/total" ).set( parseInt( course[ "public" ].assignments[ assignmentId ].total ) + parseInt( course[ "public" ].assignments[ assignmentId ].maxPoint ) );
        courseRef.child( "public/total" ).set( parseInt( course[ "public" ].total ) + parseInt( course[ "public" ].assignments[ assignmentId ].maxPoint ) );
      } else {
        oldGrade = parseInt( oldGrade );
      }
      data = parseInt( data );
      var difference = parseInt( data ) - oldGrade;
      courseRef.child( "private/" + studentId + "/grades/" + assignmentId ).set( data );
      courseRef.child( "private/" + studentId + "/earned" ).set( parseInt( course[ "private" ][ studentId ].earned ) + difference );
      courseRef.child( "public/assignments/" + assignmentId + "/earned" ).set( parseInt( course[ "public" ].assignments[ assignmentId ].earned ) + difference );
      courseRef.child( "public/earned" ).set( parseInt( course[ "public" ].earned ) + difference );
    }
    
    res.status( 200 ).send( "Success" );
  });
});

////////////////////////////////////////////////////////////////////////////////
router.post('/importcsv', function(req, res, next) {
  
  var courseId = req.query.courseid;
  var csv = req.query.csv;
  var courseRef = ref.child( "courses/" + courseId );
  
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
            if( RegExp( /^-?\d*\.?\d*$/ ).test( student[ col ] ) ) {
              if( student[ col ] != "" ) {
                var assignment = header[ col ].key;
                grades[ assignment ] = parseInt( student[ col ] );
                studentEarned += parseInt( student[ col ] );
                studentTotal += assignments[ assignment ].maxPoint;
                assignEarned[ assignment ] += parseInt( student[ col ] );
                assignTotal[ assignment ] += assignments[ assignment ].maxPoint;
              }
            } else {
              csvFormat.notes[ id ][ col ] = student[ col ];
              break;
            }
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
        courseRef.child( "public/assignments/" + key + "/earned" ).set( parseInt( assignEarned[ key ] ) );
        courseRef.child( "public/assignments/" + key + "/total" ).set( parseInt( assignTotal[ key ] ) );
      }
    }

    courseRef.child( "public/earned" ).set( parseInt( courseEarned ) );
    courseRef.child( "public/total" ).set( parseInt( courseTotal ) );

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

