import Post from '../models/Post';

export default class PostRepository {
	private postModel: typeof Post;

	constructor() {
		this.postModel = Post;
	}

	async getAllPosts() {
		try {
			return await this.postModel.find().populate('belongsTo').lean().exec();
		} catch (error) {
			throw new Error(`Failed to get all Posts: ${error}`);
		}
	}

	async createNewPost(postParams: Omit<Post, 'createdAt'>) {
		try {
			await this.postModel.create(postParams);
		} catch (error) {
			throw new Error(`Failed to create Post: ${error}`);
		}
	}
}
