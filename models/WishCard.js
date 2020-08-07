//TODO: HOW SHOULD WE STORE USER ROLE? 
//TODO: REVIEW THE RELATIONS OF THE SCHEMAS 
//TODO: USE BCRYPT FOR SALT / HASH
//TODO: ADD PASSWORD CONSTRAINTS 
//TODO: AUTHENTICATION & SECURITY & TOKENS FOR PASSWORD RESET

const mongoose = require('mongoose');

//SCHEMA SETUP
var Schema = mongoose.Schema;
var WishCardSchema = new Schema({
	childFirstName: {
		type: String,
		required: true
	},
	childLastName: {
		type: String,
		required: true
	},
	childBirthday: {
		type: Date,
		required: true
    },
    childInterest: {
		type: String,
		required: true
    },
    wishItemName: {
		type: String,
		required: true
    },
    wishItemPrice: {
		type: String,
		required: true
    },
    wishItemURL: {
		type: String,
		required: true
	},
	chlidStory: {
		type: String
    },
    wishCardImage: {
		type: String,
		required: true
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