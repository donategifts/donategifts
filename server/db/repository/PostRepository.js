const Post = require('../models/Post');

class PostRepository {
	#postModel;

	constructor() {
		this.#postModel = Post;
	}

	async getAllPosts() {
		try {
			return this.#postModel.find().populate('belongsTo');
		} catch (error) {
			throw new Error(`Failed to get all Posts: ${error}`);
		}
	}

	async createNewPost(postParams) {
		try {
			await this.#postModel.create(postParams);
		} catch (error) {
			throw new Error(`Failed to create Post: ${error}`);
		}
	}
}

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
	PostRepository,
	getAllPosts,
	createNewPost,
};
