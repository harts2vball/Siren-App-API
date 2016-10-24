/*
 * This file specifies the functionalities and interations with
 * the mongoDB server involving item objects: creating/deleting/editing items.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//-----------------------------------------------------------------------------
// Item Schemas
//-----------------------------------------------------------------------------

/*
 * This user schema is a user object that is stored inside our mongoDB server.
 */
var itemSchema = new mongoose.Schema({
	searchTerms: [ String ],
	location:
	{ 
		latitude: Number,
		longitude: Number
	},
	endDate:
	{
		type: String,
		required: true
	},
	createDate:
	{
		type: String,
		default: (new Date()).toString().slice(0,10).replace(/-/g,"")
	},
	buying: 
	{
		type: Boolean,
		required: true
	} 
});
module.exports.itemSchema = itemSchema;
module.exports.itemModel = mongoose.model('item', itemSchema);


/*
 * This item request schema sends all items listed for a user
 * already registed on the server.
 *
var itemRequestSchema = new Schema({
	faceBookUrl:
	{
		type: String,
		required: true
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
module.exports = mongoose.model('itemRequest', itemRequestSchema); */



