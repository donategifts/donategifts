const moment = require('moment');
const BaseHandler = require('./basehandler');
const { PostRepository } = require('../db/repository/PostRepository');
const { AgencyRepository } = require('../db/repository/AgencyRepository');

module.exports = class CommunityHandler extends BaseHandler {
	#postRepository;

	#agencyRepository;

	constructor() {
		super();
		this.#postRepository = new PostRepository();
		this.#agencyRepository = new AgencyRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePostIndex = this.handlePostIndex.bind(this);
	}

	async handleGetIndex(req, res, _next) {
		try {
			const { user } = req.session;
			const posts = await this.#postRepository.getAllPosts();
			res.status(200).render('pages/community', { user, posts, moment });
		} catch (error) {
			return this.handleError(res, 400, error);
		}
	}

	async handlePostIndex(req, res, _next) {
		try {
			const { user } = req.session;

			// only partner users can publish donation thank you posts
			if (user.userRole !== 'partner') {
				res.status(401).send({
					success: false,
					error: 'Only partners user can publish thank you posts',
					data: null,
				});
			}

			const agency = await this.#agencyRepository.getAgencyByUserId(user._id);

			let profileImage;

			if (req.file !== undefined) {
				let filePath;
				if (process.env.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}
				profileImage = process.env.USE_AWS === 'true' ? req.file.Location : filePath;
			}

			const newPost = {
				message: req.body.postText,
				image: profileImage || null,
				belongsTo: agency,
				agency,
			};

			await this.#postRepository.createNewPost(newPost);

			res.status(200).send({
				success: true,
				error: null,
				data: newPost,
			});
		} catch (error) {
			return this.handleError(res, 400, error);
		}
	}
};
