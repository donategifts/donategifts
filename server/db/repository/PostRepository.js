const Post = require('../models/Post');

module.exports = class PostRepository {
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
};
