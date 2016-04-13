// Function will iterate through all json objects and collect a set of all the 
// keys
function getHeaders( json ) {
    // A string row of a headers from the jsons arrange with all recognized 
    // headers in the format INSERT FORMAT LATER and all assignments in given 
    // order as read from jsons THIS MAY NEED TO BE MODIFIED
    var headers;

    return headers;
}

// Function will read a single json entry and create a default csv from it
function entryToCsv( entry, headers ) {
    var csv;                        // A string row of a csv

    return csv;
}

// Function will read a single json entry and create a blackboard csv from it
function entryToBlackBoard( entry, headers ) {
    var csv;                        // A string row of a csv

    return csv;
}

// Function will loop through all entries and convert each entry to a row in 
// the csv file
function jsonToCsv( json ) {
    var keys = Object.keys( json );
    var text = "";
    var headers = getHeaders( json );

    // This may not work
    text += headers;
    for( var key = 0; key < keys.length; ++key ) {
        object = json[ keys[ key ] ];
        // Find a way to determine if they want csv or blackboard
        text += entryToCsv( object, headers ) + "\n";
    }

    console.log( text );
}
