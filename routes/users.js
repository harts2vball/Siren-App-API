/*
 * Filename: users.js in routes
 * Description: This is where Express leads us whenever a URL begins with
 * '/users...'. Here we define different paths for the different user 
 * functionalities such as create account or delete account.
 */


//-----------------------------------------------------------------------------
// Connect to MongoDB Server via Mongoose and Load Models
//-----------------------------------------------------------------------------

//creates mongoose object and exports it
var mg = require('mongoose');
var db = mg.connection;

//gets the mongo address and connects to the server
var index = require('../index.js');
mg.Promise = global.Promise;
mg.connect(index.MA);

//load models
var Users = require('../models/users');

//-----------------------------------------------------------------------------
// Load Express and Bodyparser
//-----------------------------------------------------------------------------

var express = require('express');
var app = express();
var router = express.Router();

var bP = require('body-parser');
router.use( bP.json() );

//-----------------------------------------------------------------------------
// User Functionality Paths
//-----------------------------------------------------------------------------

/*
 * Function: creates a new user
 * Endpoint: /api/users/
 * URL Body Item:
 * {
 *		faceBookUrl: String
 *		firstName: String
 *		lastName: String
 * }
 */
router.post('/', function(req, res, next){

	//creates newUser object based on body of URL post
	var newUser = new Users.userModel();
	newUser.faceBookUrl = req.body.faceBookUrl;
	newUser.firstName = req.body.firstName;
	newUser.lastName = req.body.lastName;

	newUser.save( function(err, newUserObject){
		if(err)
		{
			var error = new Error("(500) Unable to create new account:\n" +
				"Either an account already exists with the entered "+
				"credentials\nor there are missing mandatory fields.");
			return next(error);
		}
		else
			res.json(newUserObject);
	});

});

/*
 * Function: gets a User Object by ID (actually unique fb address)
 * Endpoint: api/users?url={unique fb url}
 */
router.get('/', function(req, res, next){

	Users.userModel.findOne({ faceBookUrl: req.query.url })
		.exec(function(err, userObject){
			if(err)
			{
				var error = new Error("(500) ERROR: Invalid query to find" +
					"user by Facebook URL!");
				return next(error);
			}
			else if( userObject === null )
			{
				var error = new Error("(404) ERROR: User with the Facebook" + 
					"URL \"" + req.query.url + "\" not found!");
				return next(error);
			}
			else
				res.json(userObject);
		});
});


//-----------------------------------------------------------------------------
// Define Endpoints for Item Routes (/user/{userID}/items..)
//-----------------------------------------------------------------------------

//For item endpoints, see items.js in routes for definitions
var items = require('./items');
router.use('/items', items);

module.exports = router;

