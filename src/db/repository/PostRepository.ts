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

	/**
	 * Returns all posts for verified agencies
	 * @returns {any}
	 * @throws {Error}
	 */
	async getAllPostsByVerifiedAgencies() {
		try {
			return await this.postModel.aggregate([
				{
					$lookup: {
						from: 'agencies',
						localField: 'belongsTo',
						foreignField: '_id',
						as: 'agencyData',
					},
				},
				{
					$match: {
						'agencyData.isVerified': true,
					},
				},
				{
					$addFields: {
						belongsTo: { $arrayElemAt: ['$agencyData', 0] },
					},
				},
				{
					$unset: 'agencyData',
				},
			]);
		} catch (error) {
			throw new Error(`Failed to get posts for verified agencies: ${error}`);
		}
	}

	async createNewPost(postParams: Partial<Post>) {
		try {
			await this.postModel.create(postParams);
		} catch (error) {
			throw new Error(`Failed to create Post: ${error}`);
		}
	}
}
