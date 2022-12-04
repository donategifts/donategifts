const mongoose = require('mongoose');

// SCHEMA SETUP
const { Schema } = mongoose;
const PostSchema = new Schema(
	{
		message: {
			type: String,
		},
		image: {
			type: String,
		},
		belongsTo: {
			type: Schema.Types.ObjectId,
			ref: 'Agency',
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: 'posts',
	},
);

module.exports = mongoose.model('Post', PostSchema);
