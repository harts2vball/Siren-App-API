# Siren-App-API

This web API allows the Siren application to communicate with our serverside services such as adding buying posts, deleting posts, and much more. Here is a quick rundown of the API endpoint functionalities:


  			Findr App: API Services and Endpoints
			------------------------------------------------------------------------
			
			1. {POST} HOST/api/users
				This sends a POST request which creates a new user object and stores it in
				the MongoDB server. The body of the request should be urlencoded format.
				--------------
				URL Body Item:
			    {
			 		faceBookUrl: String
			 		firstName: String
			 		lastName: String
			    }
				--------------
				Returns:
			    New User Object with all Fields
			    {
			    	_id: ObjectId
			 		faceBookUrl: String
			 		firstName: String
			 		lastName: String
			 		createDate: String
			 		wishList: [ items ]
			 		sellList: [ items ]
			    }

			2. {GET} HOST/api/users?url={fb url}
				This service sees if an account with the specified unique fb url is already
				in our server. If it is, it returns the user object.
				--------------
				Returns:
			    User Object with the specified FB Url
			    {
			    	_id: ObjectId
			 		faceBookUrl: String
			 		firstName: String
			 		lastName: String
			 		createDate: String
			 		wishList: [ items ]
			 		sellList: [ items ]
			    }

			3. {POST} HOST/api/users/items?uid={userID}
				Create a new selling or buying item and adds it to the user's appropriate 
				item list.
				--------------
				URL Body Item:
			    {
			 		searchTerms:[ String ]
			 		location:	
			 			{ latitude: Number, longitude: Number }
			 		endDate: Date.toString()
			  		buying:	Boolean
			    }
			    --------------
				Returns:
			    New Item Object that was posted 
			    {
			    	_id: ObjectId
			 		endDate: String
			 		createDate: String
			 		searchTerms:[ String ]
			 		location:	
			 			{ latitude: Number, longitude: Number }
			 		buying: Boolean
			    }

			4. {GET} HOST/api/users/items?uid={userID}
				This returns all items in both the wishlist and sell list for a user.
				--------------
				Returns:
				List of Wish List Items
				{ }, { }...
				List of Sell List Items
				{ }, { }...

			5. {PUT} HOST/api/users/items?uid={userID}&iid={itemID}
				This updates information or settings for a specific item detailed by its ID
				--------------
				Returns:
			    New updated Item Object
			    {
			    	_id: ObjectId
			 		endDate: String
			 		createDate: String
			 		searchTerms:[ String ]
			 		location:	
			 			{ latitude: Number, longitude: Number }
			 		buying: Boolean
			    }

			6. {DELETE} HOST/api/users/items?uid={userID}&iid={itemID}
				This deletes a specific item from a user's item listings.
				--------------
				Returns:
			    Deleted Item Object
			    {
			    	_id: ObjectId
			 		endDate: String
			 		createDate: String
			 		searchTerms:[ String ]
			 		location:	
			 			{ latitude: Number, longitude: Number }
			 		buying: Boolean
			    }
