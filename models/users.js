/*
 * Filename: users.js in models folder
 * Description: This file specifies the functionalities and interations with
 * the mongoDB server involving user accounts: creating/deleting accounts
 * and specifying the user schema.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//-----------------------------------------------------------------------------
// User Schemas
//-----------------------------------------------------------------------------

/*
 * This user schema is a user object that is stored inside our mongoDB server.
 */

var itemSchema = require('./items');
itemSchema = itemSchema.itemSchema;
//definition of schema
var userSchema = new mongoose.Schema({
	faceBookUrl:
	{
		type: String,
		required: true,
		unique: true
	},
	firstName: String,
	lastName: String,
	wishList: [ itemSchema ],
	sellList: [ itemSchema ],
	createDate:
	{
		type: String,
		default: (new Date()).toString().slice(0,10).replace(/-/g,"")
	}
});
module.exports.userSchema = userSchema;
module.exports.userModel = mongoose.model('user', userSchema);


/*
 * This user request schema sends all information to check if a user is
 * already registed on the server.
 *
var userRequestSchema = new Schema({
	faceBookUrl:
	{
		type: String,
		required: true,
		unique: true
	},
	firstName:
	{
		type: String,
		required: true
	},
	lastName:
	{
		type: String,
		required: true
	}
});
module.exports = mongoose.model('userRequest', userRequestSchema); */



