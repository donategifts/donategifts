const Post = require('../models/Post');

async function getAllPosts() {
	try {
		return Post.find().populate('belongsTo');
	} catch (error) {
		throw new Error(`Failed to get all Posts: ${error}`);
	}
}

async function createNewPost(postParams) {
	try {
		const newPost = new Post(postParams);
		await newPost.save();
	} catch (error) {
		throw new Error(`Failed to create Post: ${error}`);
	}
}

module.exports = {
	getAllPosts,
	createNewPost,
};
