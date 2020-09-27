
//TODO: REVIEW THE RELATIONS OF THE SCHEMAS 
//TODO: ADD PASSWORD CONSTRAINTS 
//TODO: AUTHENTICATION & SECURITY & TOKENS FOR PASSWORD RESET

const mongoose = require('mongoose');

//SCHEMA SETUP
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	fName: {
		type: String,
		required: true
	},
	lName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	userRole: String,
	/* ROLES: Donor, Partner, Admin */
	/* IF THE USER IS PARTNER OR ADMIN, THEY CAN CREATE WISH CARDS*/
	wishCards: [{
		type: Schema.Types.ObjectId,
		ref: 'WishCard'
	}],
	donationsMade: [{
		type: Schema.Types.ObjectId,
		ref: 'Donation'
	}],
	joined: {
		type: Date,
		default: Date.now
    },
    aboutMe: {
		type: String,
		required: false
	},
}, {
	collection: 'users'
});

module.exports = mongoose.model('User', UserSchema);