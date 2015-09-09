"use strict";

var fs = require( "fs" );

var parse = {};

parse.parseContent = function ( text, cb )
{
    var files = [];
    var modes = text.split( "mode:" );

    if( !modes.length )
    {
        return cb( new Error( "No coverage found" ) );
    }

    var lines = modes[ 1 ].replace( "\r\n", "\n" ).split( /[\n\r]/g );
    lines = lines.slice( 1 ); // the first line is just the mode type

    lines.forEach( function ( line )
    {
        var parts = line.split( ":" );
        if( !parts.length )
        {
            return;
        }

        var path = parts[ 0 ];
        var values = parts[ 1 ];

        if( !path || !values )
        {
            return;
        }

        if( !files[ files.length - 1 ] || files[ files.length - 1 ].file !== path )
        {
            var name = path.split( "/" );
            name = name[ name.length - 1 ];

            files.push( {
                title: name,
                file: path,
                lines: {
                    found: 0,
                    hit: 0,
                    details: []
                },
                functions: {
                    found: 0,
                    hit: 0,
                    details: []
                }
            } );
        }

        var file = files[ files.length - 1 ];

        var lineNumber = Number( values.split( "," )[ 0 ].split( "." )[ 0 ] );
        var hit = Number( values.split( " " )[ 2 ] );

        file.lines.found++;
        file.lines.details.push( {
            line: lineNumber,
            hit: hit
        } );
    } );

    files.forEach( function ( file )
    {
        file.lines.hit = file.lines.details.reduce( function ( acc, val )
        {
            return acc + ( val.hit > 0 ? 1 : 0 );
        }, 0 );
    } );

    cb( null, files );
};

parse.parseFile = function ( file, cb )
{
    fs.readFile( file, "utf8", function ( err, content )
    {
        if( err )
        {
            return cb( err );
        }

        parse.parseContent( content, cb );
    } );
};

module.exports = parse;
