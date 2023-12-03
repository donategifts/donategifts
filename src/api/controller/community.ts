import { NextFunction, Request, Response } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';
import PostRepository from '../../db/repository/PostRepository';
import config from '../../helper/config';

import BaseController from './basecontroller';

export default class CommunityController extends BaseController {
	private agencyRepository: AgencyRepository;
	private postRepository: PostRepository;

	constructor() {
		super();

		this.agencyRepository = new AgencyRepository();
		this.postRepository = new PostRepository();
	}

	async handleAddPost(req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;

			if (!user) {
				return this.handleError(res, 'You must be logged in to make a post!');
			}

			const agency = await this.agencyRepository.getAgencyByUserId(user._id);

			if (!agency?.isVerified) {
				return this.handleError(
					res,
					'Please make sure your agency is verified before submitting your post.',
				);
			}

			let profileImage: string | null = null;

			if (req.file) {
				let filePath: string | null = null;
				if (config.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}
				profileImage = config.AWS.USE ? req.file.Location : filePath;
			}

			const newPost = {
				message: req.body.message,
				image: profileImage,
				belongsTo: agency?._id.toString() || user._id.toString(),
			};

			await this.postRepository.createNewPost(newPost);

			const posts = (await this.postRepository.getAllPostsByVerifiedAgencies()).sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
			);

			return this.sendResponse(res, posts);
		} catch (error: any) {
			return this.handleError(res, error);
		}
	}
}
