import AgencyRepository from '../db/repository/AgencyRepository';
import PostRepository from '../db/repository/PostRepository';

import BaseController from './basecontroller';

export default class CommunityController extends BaseController {
	private postRepository: PostRepository;

	private agencyRepository: AgencyRepository;

	constructor() {
		super();
		this.postRepository = new PostRepository();
		this.agencyRepository = new AgencyRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);

		this.handleAddPost = this.handleAddPost.bind(this);
	}

	async handleGetIndex(req, res, _next) {
		try {
			const posts = (await this.postRepository.getAllPosts()).sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
			);
			this.renderView(res, 'pages/community', { posts });
		} catch (error: any) {
			return this.handleError({ res, code: 400, error });
		}
	}

	async handleAddPost(req, res, _next) {
		try {
			const { user } = req.session;

			if (!user) {
				return this.handleError({
					res,
					code: 401,
					error: 'You must be logged in to make a post!',
				});
			}

			const agency = await this.agencyRepository.getAgencyByUserId(user._id);

			let profileImage: string | null = null;

			if (req.file !== undefined) {
				let filePath;
				if (process.env.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}
				profileImage = process.env.USE_AWS === 'true' ? req.file.Location : filePath;
			}

			const newPost = {
				message: req.body.message,
				image: profileImage,
				belongsTo: agency?._id.toString() || user._id.toString(),
			};

			await this.postRepository.createNewPost(newPost);

			const posts = (await this.postRepository.getAllPosts()).sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
			);

			res.status(200).send({
				posts,
			});
		} catch (error: any) {
			return this.handleError({ res, code: 400, error });
		}
	}
}
