// Function will iterate through all json objects and collect a set of all the 
// keys
function getHeader( json ) {
    var header = [];

    for( var key in json ) {
        for( var entry in json[ key ] ) {
            if( header.indexOf( entry ) == -1 ) {
                header.push( entry );
            }
        }
    }

    return header;
}

// Function will read a single json entry and create a default csv from it
function entryToCsv( entry, header ) {
    var csv = new Array( header.length );
    var len = header.length;

    for( var key in entry ) {
        csv[ header.indexOf( key ) ] = entry[ key ];
    }

    return csv;
}

// Function will read a single json entry and create a blackboard csv from it
function entryToBlackBoard( entry, header ) {
    var csv;                        // A string row of a csv
    //Last Name, First Name, Username, Student ID, Last Access, Availability, Weighted Total [Total Pts: up to 0], Total [Total Pts: up to 0]

    return csv;
}

// Function will return the header with special treatment of fields: first name, 
// last name, and id
function headerToString( header ) {
    if( header == "first" ) {
        return "First Name";
    } else if( header == "last" ) {
        return "Last Name";
    } else if( header == "id" ) {
        return "ID";
    } else {
        return header;
    }
}

// Function will loop through all entries and convert each entry to a row in 
// the csv file
function jsonToCsv( json ) {
    var header = getHeader( json );
    var csv = "";

    // Creates the header row
    for( var col = 0; col < header.length - 1; ++col ) {
        csv += headerToString( header[ col ] ) + ","
    }
    csv += headerToString( header[ header.length - 1 ] ) + "\n";

    // This may not work
    for( var key in json ) {
        csv += entryToCsv( json[ key ], header ) + "\n";
    }

    return csv;
}

// Just a temp
function textToJsonToCsv() {
    var data = document.getElementById( "data" );
    var json = JSON.parse( data.value );

    var csv = jsonToCsv( json );

    console.log( csv );
    document.getElementById( "output" ).innerHTML = csv;
}
