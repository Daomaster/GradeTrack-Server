/*
student name, quiz 1, Homework 2, Quiz 2,, final
Jason Diaz, 12.3, 34.5, 67.8, asdf , 90.1
Jason Allen, 23.4, 56.7, 89.0,, 24.6
Betty J. Rodriguez, 81.3, 57.9, 98.7,, 65.4
Matthew j. Johnson-Johnson, 32.1, 09.8, 76.5,, 43.2
Bobby k. kit kat, 32.1, 09.8, 76.5,, 43.2
123456, 10.9, 87.6, 54.3,, 21.0

Last Name, First Name, Username, Student ID, Last Access, Availability, Weighted Total [Total Pts: up to 0], Total [Total Pts: up to 0]
*/

var Field = Object.freeze( {
    "FIRST_NAME" : 0x0001,
    "LAST_NAME" : 0x0002,
    "USER_NAME" : 0x0004,
    "ID" : 0x0008,
    "LAST_ACCESS" : 0x0010,
    "AVAILABILITY" : 0x0020,
    "WEIGHTED_TOTAL" : 0x0040,
    "TOTAL" : 0x0080,
    "ASSIGNMENT" : 0x0100,
    "GRADE" : 0x0200,
    "BLANK" : 0x0400,
    "REQUIRED" : 0x0800,
    "BLACKBOARD" : 0x1000/*,
    "" : 0x2000,
    "" : 0x4000,
    "" : 0x8000,*/
} );

////////////////////////////////////////////////////////////////////////////////
function getType( cell ) {
    var type = 0;

    cell = cell.trim( " " ).toLowerCase();
    if( cell.length == 0 ) {
        type = Field.BLANK;
    } else if( cell.length == 1 && cell[ 0 ] == '.' ) {
        type = 0;
    } else if( RegExp( /^-?\d*\.?\d*$/ ).test( cell ) ) {
        type = Field.GRADE;
    } else if( RegExp( /^last(\s+(names?|!access))?$/ ).test( cell ) ) {
        type = Field.LAST_NAME;
    } else if( RegExp( /^first(\s+names?)?$/ ).test( cell ) ) {
        type = Field.FIRST_NAME;
    } else if( RegExp( /^user(\s*(name))?s?$/ ).test( cell ) ) {
        type = Field.USER_NAME;
    } else if( RegExp( /^((student)?s?\s+ids?|ids?)$/ ).test( cell ) ) {
        type = Field.ID;
    } else if( RegExp( /^last(\s+(!name|access))?$/ ).test( cell ) ) {
        type = Field.LAST_ACCESS;
    } else if( RegExp( /^availability$/ ).test( cell ) ) {
        type = Field.AVAILABILITY;
    } else if( RegExp( /^weighted\s+total/ ).test( cell ) ) {
        type = Field.WEIGHTED_TOTAL;
    } else if( RegExp( /^total/ ).test( cell ) ) {
        type = Field.TOTAL;
    }

    return type;
}

////////////////////////////////////////////////////////////////////////////////
function getTypes( csv ) {
    // Tries reading the rows to find a header
    for( var row = 0; row < csv.length; ++row ) {
        // Iterate over all rows and count any header type cells
        for( var col = 0; col < csv[ row ].length; ++col ) {
            // Update types
            csv[ row ][ col ] = { 
                "field" : getType( csv[ row ][ col ] ),
                "value" : csv[ row ][ col ],
            };
        }
    }

    return csv;
}

////////////////////////////////////////////////////////////////////////////////
function getHeader( csv ) {
    var header = undefined;

    // Search all the row and columns for the first name, last name and id 
    // field. These field are required for a valid json object. Everything 
    // else if consider mutable.
    for( var row = 0; row < csv.length; ++row ) {
        var hasFirst = false;
        var hasLast = false;
        var hasId = false;
        for( var col = 0; col < csv[ row ].length; ++col ) {
            var cell = csv[ row ][ col ];
            hasFirst |= cell.field & Field.FIRST_NAME;
            hasLast |= cell.field & Field.LAST_NAME;
            hasId |= cell.field & Field.ID;
            // If the field is unknown then assume at it is an assignment
            if( cell.field == 0 ) {
                cell.field = Field.ASSIGNMENT;
            }
        }
        // If the row head everything the break out of the loop
        if( hasFirst && hasLast && hasId ) {
            header = row;
            break;
        }
    }

    return header;
}

////////////////////////////////////////////////////////////////////////////////
function csvToJson() {
    var output = document.getElementById( "output" );
    var textBox = document.getElementById( "textBox" );
    var lines = textBox.value;

    var csv = textToArray( lines );
    getTypes( csv );

    var header = getHeader( csv )
    output.innerHTML += header;

    var temp = arrayToJson( csv, header );
    var json = temp.json;
    var errors = temp.errors;
    console.log( "errors: " + errors );

    console.log( JSON.stringify( json, null, 2 ) );
    output.innerHTML = JSON.stringify( json, null, 2 );

    return json;
}

////////////////////////////////////////////////////////////////////////////////
function arrayToJson( csv, header ) {
    var json = {};
    var errors = []
    var headerLength = csv[ header ].length;

    // Iterate through all rows below header
    for( var row = header + 1; row < csv.length; ++row ) {
        // A temp object for the row's info
        var temp = {};

        // Required field flags
        var hasFirst = false;
        var hasLast = false;
        var hasId = false;

        // Checks if the head and the current row are the same length
        // If their not iterate through the smaller of the two and print 
        // appropriate errors (ie unheaded cell and blank cell)
        var rowLength = csv[ row ].length
        if( rowLength != headerLength ) {
            column = Math.min( rowLength, headerLength );
        } else {
            column = rowLength;
        }

        // For every headed column in the row
        for( var col = 0; col < column; ++col ) {
            var head = csv[ header ][ col ];
            var self = csv[ row ][ col ];

            // Check for assignment
            if( head.field & Field.ASSIGNMENT ) {
                if( self.field & Field.GRADE ) {
                    temp[ head.value ] = self.value;
                } else if( self.field & Field.BLANK ) {
                    var e = "Blank cell at row " + row + " and column " + col;
                    console.log( e );
                } else {
                    var e = "Unregonized cell at row " + row + " and column " + col;
                    console.log( e );
                    temp[ head.value ] = "NA";
                }
            }
            // Check for first name
            else if( head.field & Field.FIRST_NAME ) {
                if( self.field & Field.BLANK ) {
                    temp[ "first" ] = "NA";
                } else {
                    temp[ "first" ] = self.value;
                    hasFirst = true;
                }
            }
            // Check for last name
            else if( head.field & Field.LAST_NAME ) {
                if( self.field & Field.BLANK ) {
                    temp[ "last" ] = "NA";
                } else {
                    temp[ "last" ] = self.value;
                    hasLast = true;
                }
            }
            // Check for id
            else if( head.field & Field.ID ) {
                if( self.field & Field.BLANK ) {
                    temp[ "id" ] = "NA";
                } else {
                    temp[ "id" ] = self.value;
                    hasId = true;
                }
            }
            // Check if the cell is filled while their is a header is blank
            else if( head.field & Field.BLANK && !(self.field & Field.BLANK) ) {
                var e = "Unheaded cell at row " + row + " and column " + col;
                console.log( e );
            }
        }

        // If the row length and the header length are unequal then produce the 
        // error message
        if( rowLength < headerLength ) {
            for( var col = column; col < headerLength; ++col ) {
                var e = "Blank cell at row " + row + " and column " + col;
                console.log( e );
            }
        } else if( rowLength > headerLength ) {
            for( var col = column; col < rowLength; ++col ) {
                var e = "Unheaded cell at row " + row + " and column " + col;
                console.log( e );
            }
        }


        if( hasFirst && hasLast && hasId ) {
            json[ temp.id ] = temp;
        } else {
            e = "Row " + row + " missing:" + ( hasFirst ? "" : " first name" ) + ( hasLast ? "" : " last name" ) + ( hasId ? "" : " id" );
            console.log( e );
        }
    }

    return { "json" : json, "errors" : errors };
}

////////////////////////////////////////////////////////////////////////////////
function textToArray( lines ) {
    if( lines.trim( " " ) == "" ) {
        return [];
    }

    var csv = lines.split( "\n" );
    for( var line = 0; line < csv.length; ++line ) {
        // Splits the line into array elements
        csv[ line ] = csv[ line ].split( "," );
        // Clean up extra spaces
        for( var word = 0; word < csv[ line ].length; ++word ) {
            csv[ line ][ word ] = csv[ line ][ word ].trim( " " );
        }
    }

    return csv;
}
