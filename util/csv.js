/*
student name, quiz 1, Homework 2, Quiz 2,, final
Jason Diaz, 12.3, 34.5, 67.8, asdf , 90.1
Jason Allen, 23.4, 56.7, 89.0,, 24.6
Betty J. Rodriguez, 81.3, 57.9, 98.7,, 65.4
Matthew j. Johnson-Johnson, 32.1, 09.8, 76.5,, 43.2
Bobby k. kit kat, 32.1, 09.8, 76.5,, 43.2
123456, 10.9, 87.6, 54.3,, 21.0
*/

var Orientation = Object.freeze( { "UNKNOWN" : 0, "ROW" : 1, "COL" : 2 } );

var Field = Object.freeze( {
    "HEADER" : 0x0001,
    "ASSIGNMENT" : 0x0002,
    "GRADE" : 0x0004,
    "FIRST" : 0x0008,
    "LAST" : 0x0010,
    "NAME" : 0x0020,
    "ID" : 0x0040,
    "STUDENT" : 0x0080,
    "BLANK" : 0x0100/*,
    "" : 0x0200,
    "" : 0x0400,
    "" : 0x0800,
    "" : 0x1000,
    "" : 0x2000,
    "" : 0x4000,
    "" : 0x8000,*/
} );

function arrayToJson( csv, header ) {
    var json = [];

    for( var row = header.index + 1; row < csv.length; ++row ) {
        var temp = {};
        for( var col = 0; col < csv[ row ].length; ++col ) {
            head = csv[ header.index ][ col ];
            self = csv[ row ][ col ];

            // If the cell is blank then put an NA at the spot
            if( ( self.field & Field.BLANK ) ) {
                value = "NA";
            } else {
                value = self.value;
            }

            // If the head field is an assignment
            if( head.field & Field.ASSIGNMENT ) {
                // The cell has a grade
                if( self.field & Field.GRADE ) {
                    temp[ head.value ] = self.value;
                } else {
                    temp[ head.value ] = "NA";
                }
            } else if( head.field & Field.FIRST ) {
                temp[ "first" ] = value;
            } else if( head.field & Field.LAST ) {
                temp[ "last" ] = value;
            } else if( head.field & Field.ID ) {
                temp[ "id" ] = value;
            } else if( head.field & Field.NAME ) {
                var _name = parseName( value );
                temp[ "first" ] = _name.first;
                temp[ "middle" ] = _name.middle;
                temp[ "last" ] = _name.last;
            } else if( head.field & Field.STUDENT ) {
                if( isId( value ) ) {
                    temp[ "id" ] = value;
                } else {
                    var _name = parseName( value );
                    temp[ "first" ] = _name.first;
                    temp[ "middle" ] = _name.middle;
                    temp[ "last" ] = _name.last;
                }
            } else if( head.field & Field.BLANK && (self.field & Field.BLANK) == 0 ) {
                console.log( "Unheaded cell at row " + row + " and column " + col );
            }
        }
        json.push( temp );
    }

    return json;
}

function isId( data ) {
    if( RegExp( /^[0-9]+$/ ).test( data ) ) {
        return true;
    }
    return false;
}

function parseName( _name ) {
    var first = null;
    var middle = null;
    var last = null;

    // First Middle Last or First Middle Last Last or First Middle Last-Last
    if( RegExp( /^\w+\s+\w+\.?\s+\w+((\s+|-)\w+)?$/ ).test( _name ) ) {
        _name = _name.split( RegExp( /\s+/ ) );
        first = _name[ 0 ];
        middle = _name[ 1 ];
        last = _name[ 2 ];
        if( _name.length == 4 ) {
            last += " " + _name[ 3 ];
        }
    // Last, First or Last-Last, first
    } else if( RegExp( /^\w+,\s+\w+$/ ).test( _name ) ) {
        _name = _name.split( RegExp( /,\s*/ ) );
        first = _name[ 1 ];
        last = _name[ 0 ];
    // First Last or First Last Last or First Last-Last
    } else if( RegExp( /^\w+\s+\w+((\s+|-)\w+)?$/ ).test( _name ) ) {
        _name = _name.split( RegExp( /\s+/ ) );
        first = _name[ 0 ];
        last = _name[ 1 ];
    } else {
        last = _name;
    }

    return { "first" : first, "middle" : middle, "last" : last };
}

////////////////////////////////////////////////////////////////////////////////
function csvToJson() {
    var output = document.getElementById( "output" );
    var textBox = document.getElementById( "textBox" );
    var lines = textBox.value;

    var csv = textToArray( lines );
    getTypes( csv );

    output.innerHTML = "";
    for( var row = 0; row < csv.length; ++row ) {
        for( var col = 0; col < csv[ row ].length; ++col ) {
//            output.innerHTML += csv[ row ][ col ].meta.type + " " + csv[ row ][ col ].value + ", ";
            output.innerHTML += csv[ row ][ col ].value + ", ";
        }
        output.innerHTML += "<br></br>";
    }
    var header = getHeader( csv )
    output.innerHTML += header.orientation + " ";
    output.innerHTML += header.index;

    var json = arrayToJson( csv, header );

    for( var iter = 0; iter < json.length; ++iter ) {
        console.log( json[ iter ] );
    }

    return json;
}

////////////////////////////////////////////////////////////////////////////////
function getHeader( csv ) {
    // The index of the headers
    var header = -1;

    // Tries reading the rows to find a header
    for( var row = 0; row < csv.length; ++row ) {
        // The number of header cells in this row
        var headerCount = 0;
        // Iterate over all rows and count any header type cells
        for( var col = 0; col < csv[ row ].length; ++col ) {
            // If the type of the cell is header then increase header count
            if( csv[ row ][ col ].field & Field.HEADER ) {
                headerCount += 2;
            } else if( csv[ row ][ col ].field != 0 ) {
                headerCount -= 1;
            }
        }
        // If headerCount is greater then 3/4 of the width then assume it is  
        // the header
        if( headerCount > 3 * csv[ row ].length / 4 && header == -1 ) {
            header = row;
        }
    }

    if( header != -1 ) {
        return { "orientation" : Orientation.ROW , "index" : header };
    }

    return { "orientation" : -1 , "index" : -1 };
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

////////////////////////////////////////////////////////////////////////////////
function getType( cell ) {
    var patt;
    var type = 0;

    cell = cell.trim( " " );
    if( cell.length == 0 ) {
        type = Field.BLANK;
    } else if( cell.length == 1 && cell[ 0 ] == '.' ) {
        type = 0;
    } else if( RegExp( /^-?\d*\.?\d*$/ ).test( cell ) ) {
        type = Field.GRADE;
    } else if( RegExp( /(home|hw)/i ).test( cell ) ) {
        type = Field.ASSIGNMENT | Field.HEADER;
    } else if( RegExp( /(classw|cw|coursew)/i ).test( cell ) ) {
        type = Field.ASSIGNMENT | Field.HEADER;
    } else if( RegExp( /(extra|cw|coursew)/i ).test( cell ) ) {
        type = Field.ASSIGNMENT | Field.HEADER;
    } else if( RegExp( /(mid)/i ).test( cell ) ) {
        type = Field.ASSIGNMENT | Field.HEADER;
    } else if( RegExp( /(final)/i ).test( cell ) ) {
        type = Field.ASSIGNMENT | Field.HEADER;
    } else if( RegExp( /(test|exam)/i ).test( cell ) ) {
        type = Field.ASSIGNMENT | Field.HEADER;
    } else if( RegExp( /(quiz)/i ).test( cell ) ) {
        type = Field.ASSIGNMENT | Field.HEADER;
    } else if( RegExp( /(assign|asst)/i ).test( cell ) ) {
        type = Field.ASSIGNMENT | Field.HEADER;
    } else if( RegExp( /(first)/i ).test( cell ) ) {
        type = Field.FIRST | Field.HEADER;
    } else if( RegExp( /(last)/i ).test( cell ) ) {
        type = Field.LAST | Field.HEADER;
    } else if( RegExp( /(student|class)/i ).test( cell ) ) {
        type = Field.STUDENT | Field.HEADER;
    } else if( RegExp( /(name)/i ).test( cell ) ) {
        type = Field.NAME | Field.HEADER;
    } else if( RegExp( /(id|nshe)/i ).test( cell ) ) {
        type = Field.ID | Field.HEADER;
    } else if( RegExp( /(proj)/i ).test( cell ) ) {
        type = Field.PROJECT | Field.HEADER;
    }


    return type;
}

