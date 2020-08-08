//TODO: REVIEW THE RELATIONS OF THE SCHEMAS 
//TODO: edit the image file types

const mongoose = require('mongoose');

//SCHEMA SETUP
var Schema = mongoose.Schema;
var AgencySchema = new Schema({
	agencyName: {
		type: String,
		required: true
	},
	agencyWebsite: {
		type: String
	},
	agencyPhone: {
        type: Number,
        required: true
    },
    accountManager: {
		type: Schema.Types.ObjectId,
		ref: 'User'
    },
    agencyBio: {
		type: String
    },
    agencyAddress: {
		type: String
    },
    childrenUnderCare: {
		type: Number
    },
    childrenAgeRange: {
		type: String
	},
	agencyProfileImage: {
		type: String
    },
    wishCards: [{
		type: Schema.Types.ObjectId,
		ref: 'WishCard'
    }],
	joinedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	joined: {
		type: Date,
		default: Date.now
	},
}, {
	collection: 'agencies'
});

module.exports = mongoose.model('Agency', AgencySchema);