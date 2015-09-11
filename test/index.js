"use strict";

var assert = require( "assert" );
var parse = require( "../source" );
var path = require( "path" );

describe( "parseFile", function ()
{
    it( "should parse a file", function ( done )
    {
        parse.parseFile( path.join( __dirname, "assets", "cover.out" ), function ( err, result )
        {
            assert.equal( err, null );
            assert.equal( result.length, 5 );
            assert.equal( result[ 0 ].lines.found, 210 );
            assert.equal( result[ 0 ].lines.hit, 111 );
            assert.equal( result[ 0 ].lines.details[ 0 ].line, 44 );
            assert.equal( result[ 0 ].lines.details[ 0 ].hit, 0 );
            done();
        } );
    } );
} );
