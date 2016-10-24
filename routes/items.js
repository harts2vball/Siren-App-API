/*
 * Filename: items.js in routes
 * Description: This is where Express leads us whenever a URL begins with
 * '/users/{userID}/items..'. Here we define different paths for the different
 * item functionalities such as create/edit/delete item listings.
 */

//-----------------------------------------------------------------------------
// Load Express, Bodyparser, and Mongoose Models
//-----------------------------------------------------------------------------

//load express
var express = require('express');
var app = express();
var router = express.Router();

//load bodyparser into bP
var bP = require('body-parser');
router.use( bP.json() );
router.use( bP.urlencoded({
	extended: true
}) );

//load model files
var Users = require('../models/users');
var Items = require('../models/items');

//-----------------------------------------------------------------------------
// User Functionality Paths
//-----------------------------------------------------------------------------

/*
 * Function: adds an item to a user object by iD
 * Endpoint: /api/users/items?uid={userID}
 * Body Object:
 * {
 *		searchTerms:[]
 *		location:	
 *			{ latitude: Number, longitude: Number }
 *		endDate: Date
 * 		buying:	Boolean
 * }		
 */
router.post('/', function(req, res, next){
	
	//creates new item schemaobject based on body of URL post
	var newItem = new Items.itemModel();
	newItem.searchTerms = req.body.searchTerms;
	newItem.location.latitude = req.body.location.latitude;
	newItem.location.longitude = req.body.location.longitude;
	newItem.endDate = req.body.endDate;
	newItem.buying = req.body.buying;

	//checks for duplicate items in wishList db
	Users.userModel.findOne( { 'wishList.searchTerms': newItem.searchTerms, 
								'_id': req.query.uid}, function( err, record ){
		if( err )
		{
			var error = new Error("(404) ERROR: User with UID=" +
				req.query.uid + " not found!" );
			return next(error);
		}
		
		//if record found, then error: duplicates!
		if( record && ( newItem.buying === true || newItem.buying === "true" ))
		{
			var error = new Error("(500) ERROR: There is already an item " +
				"that exists. No duplicate search terms for items allowed!");
			return next(error);
		}
		//else update user doc
		else
		{
			//first finds the user doc and then updates the appropriate array
			Users.userModel.findById( req.query.uid, function( err, doc ){
		
			//deals with errors
			if( err )
			{
				var error = new Error("(500) ERROR: Problem with finding a " +
					"user by ID while in the process of posting a new item.");
				return next(error);
			}

			//if uid is incorrect
			if( !doc )
			{
				var error = new Error("(404) ERROR: User with UID=" +
				req.query.uid + " not found!" );
				return next(error);
			}

			//first deals with if item is for wishList
			if( newItem.buying === true ||  newItem.buying === "true" )
			{
				//doc.wishList.push(newItem, function(err, addedSubDoc){
				doc.update({$push:{"wishList": newItem}}, function(err, model){

					//handles error
					if(err)
					{
						var error = new Error("(500) ERROR: Problem while " +
						"trying to insert an item into a user's wish list!");
						return next(error);
					}

					res.send("Added: \n" + newItem + "\nto wishList");	
	    		} );
			}
			//deals with if item is for sellList
			else if( newItem.buying === false ||  newItem.buying === "false" )
			{
				//doc.sellList.push(newItem, function(err, addedSubDoc){
				doc.update({$push:{"sellList": newItem}}, function(err, model){

					//handles error
					if(err)
					{
						var error = new Error("(500) ERROR: Problem while " +
						"trying to insert an item into a user's sell list!");
						return next(error);
					}

					//response for a successful insertion of nonduplicate item!
	    			res.send("Added: \n" + newItem + "\nto sellList");
					
	    		} );

			}
			//else throw error because buying element not set
			else
			{
				var error = new Error("(500) ERROR: 'buying' index is not set!");
				return next(error);
			}
		} ); //end of block to find user to update items list
		} //end of else block
	} ); //end of block that begins with checking for duplicates
} ); //end of router.post


/*
 * Function: get all item listings (sell/buy) for a user
 * Endpoint: /api/users/items?uid={userID}
 */
router.get('/', function(req, res, next){
	
	Users.userModel.findOne({ _id: req.query.uid })
		//.populate( 'wishList sellList' )
		.exec(function(err, userObject){

			//first deals with errors
			if(err)
			{
				var error = new Error("(404) ERROR: User with UID=" +
					req.query.uid + " does not exist!");
				return next(error);
			}
			else if( userObject === null )
			{
				var error = new Error("(500) ERROR:" +
					" user with UID=" + req.query.uid + " not found!" );
				return next(error);
			}
			//successful response: list of all items on wishlist and selllist
			else
			{
				res.send("WISH LIST\n" + "=================================\n"+
					JSON.stringify(userObject.wishList, null, 4) +  
					"\n\n================================="+
					"\nSELL LIST\n" + "=================================\n" + 
					JSON.stringify(userObject.sellList, null, 4) );
			}
		});
});

/*
 * Function: delete an item by ID for a user
 * Endpoint: /api/users/items?uid={userID}&iid={itemID}
 */
router.delete('/', function(req, res, next){

	Users.userModel.findOne({ _id: req.query.uid })
		.exec(function(err, userObjectDoc){

			//deals with error of not finding user document with uid
			if( userObjectDoc == null)
			{
				var error = new Error("(500) ERROR: Could not find user " + 
					"with uid=" + req.query.uid);
					return next(error);
			}

			//find item document within specified user
			var doc = userObjectDoc.wishList.id(req.query.iid);
			if( doc == null )
				doc = userObjectDoc.sellList.id(req.query.iid);

			//deals with error of no item in said user
			if( doc == null )
			{
				var error = new Error("(500) ERROR: Item ID " + 
						"does not exist! (uid=" + req.query.uid + ")");
					return next(error);
			}

			//remove the item with matching ID
			try
			{
				doc.remove();
			}
			catch(err)
			{
				err.message = "(500) ERROR: A problem occured while " + 
				"attempting to remove an item document from the appropriate" + 
				" user document.";
				return next(err);
			}
			
			//save changes made to the user doc after removal
			userObjectDoc.save(function(err){
				if(err)
				{
					console.log(err);
					var error = new Error("(500) Server ERROR!");
					return next(error);
				}
				//Normal response
				res.json( doc );
		});
	});

});

/*
 * Function: edit an item by ID for a user
 * Endpoint: /api/users/items?uid={userID}&iid={itemID}
 */
router.put('/', function(req, res, next){

	//finds user with specific uid
	Users.userModel.findOne({ _id: req.query.uid })
	.exec(function(err, userObjectDoc){

		//deals with error of not finding user document with uid
		if( userObjectDoc == null)
		{
			var error = new Error("(500) ERROR: Could not find user " + 
				"with uid=" + req.query.uid);
				return next(error);
		}

		//find item document within specified user
		if(req.body.buying)
		{
			var itemDoc = userObjectDoc.wishList.id(req.query.iid);
		}
		else //search for item in seller list
		{
			var itemDoc = userObjectDoc.sellList.id(req.query.iid);
		}
		
		//deals with error of no item in said user
		if( itemDoc == null )
		{
			var error = new Error("(500) ERROR: Item ID " + 
					"does not exist! (uid=" + req.query.uid + ")");
				return next(error);
		}

		//updates item fields
		itemDoc.searchTerms = req.body.searchTerms;
		itemDoc.location.latitude = req.body.location.latitude;
		itemDoc.location.longitude = req.body.location.longitude;
		itemDoc.endDate = req.body.endDate;
		itemDoc.buying = req.body.buying;

		//save changes made to the user doc after removal
		userObjectDoc.save(function(err){
			if(err)
			{
				console.log(err);
				var error = new Error("(500) Error while trying to save " + 
					"updated item document!");
				return next(error);
			}
			
			//Normal response
			res.json( itemDoc );
		});
	});
});

module.exports = router;


