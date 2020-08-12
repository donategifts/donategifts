//TODO: HOW SHOULD WE STORE USER ROLE? 
//TODO: REVIEW THE RELATIONS OF THE SCHEMAS 

const mongoose = require('mongoose');

//SCHEMA SETUP
var Schema = mongoose.Schema;
var WishCardSchema = new Schema({
	childFirstName: {
		type: String
	},
	childLastName: {
		type: String
	},
	childBirthday: {
		type: Date
    },
    childInterest: {
		type: String
    },
    wishItemName: {
		type: String
    },
    wishItemPrice: {
		type: String
    },
    wishItemURL: {
		type: String
	},
	childStory: {
		type: String
    },
    wishCardImage: {
		type: String
    },
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
}, {
	collection: 'wishcards'
});

module.exports = mongoose.model('WishCard', WishCardSchema);