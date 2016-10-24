/*
 * Filename: index.js
 * Description: This is the main starting file for our Express server in
 *	Node.js. It also uses Mongoose to interact with our MongoDB server from
 *  different endpoints.
 */

//-----------------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------------

//host port
var HOST_PORT = 3000;

//Shares MongoDB address with route files
var MONGODB_ADDRESS = "mongodb://localhost/test";
module.exports.MA = MONGODB_ADDRESS;


//-----------------------------------------------------------------------------
// Initiate and Define Endpoints for Express Server
//-----------------------------------------------------------------------------

//imports express package into var express and creates app
var express = require('express'); 
var app = express();

//imports all model files from the models folder
var fs = require('fs');
fs.readdirSync(__dirname + '/models').forEach( function( filename ){
	if( ~filename.indexOf('.js') ) require(__dirname + '/models/' + filename );
});

//define route uses for /users interations with API
var users = require('./routes/users');
app.use('/api/users', users);

//displays the API help page
var path = require('path');
app.get('/api', function(req, res){
	var path = require('path');
	res.sendFile(path.join(__dirname +'/views/info.html'));
});

//deals with an undefinted URL (catches 404 and hands error to error handler)
app.use( function(req, res, next){

	var err = new Error("(404) Page Not Found.\n" +
		"For API services use /api");
	next( err );
} );

//error handler after all middleware
app.use( function(err, req, res, next){
	//obtains HTML status code
	res.status( parseInt(err.message.slice(1,4)));

	//prints rest of error message after code
	res.send( err.message.slice(6) );
} );


//-----------------------------------------------------------------------------
// Express Server Listening Functionality
//-----------------------------------------------------------------------------

//tells Express app to listen at specific port
app.listen(HOST_PORT, function(){
	console.log("Listening on port: " + HOST_PORT + "...");
});


