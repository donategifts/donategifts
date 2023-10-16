import { NextFunction, Request, Response } from 'express';
import { Kysely } from 'kysely';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import CommunityPostsRepository from '../../db/repository/postgres/CommunityPostsRepository';
import ImagesRepository from '../../db/repository/postgres/ImagesRepository';
import { DB } from '../../db/types/generated/database';
import config from '../../helper/config';

import BaseController from './basecontroller';

export default class CommunityController extends BaseController {
	private agencyRepository: AgenciesRepository;
	private postRepository: CommunityPostsRepository;
	private imagesRepository: ImagesRepository;

	constructor(database: Kysely<DB>) {
		super();

		this.agencyRepository = new AgenciesRepository(database);
		this.postRepository = new CommunityPostsRepository(database);
		this.imagesRepository = new ImagesRepository(database);

		this.addPost = this.addPost.bind(this);
	}

	async addPost(req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;

			if (!user) {
				return this.handleError(res, 'You must be logged in to make a post!');
			}

			const agency = await this.agencyRepository.getByAccountManagerId(user.id);

			if (!agency.is_verified) {
				return this.handleError(
					res,
					'Please make sure your agency is verified before submitting your post.',
				);
			}

			const filePath = `/uploads/${req.file.filename}`;
			const profileImage = config.AWS.USE ? req.file.Location : filePath;

			const image = await this.imagesRepository.create({
				url: profileImage,
				created_by: user.id,
			});

			await this.postRepository.create({
				message: req.body.message,
				image_id: image.id,
				agency_id: agency.id,
			});

			const posts = (await this.postRepository.getByAgencyVerificationStatus(true)).sort(
				(a, b) => a.created_at.getTime() - b.created_at.getTime(),
			);

			return this.sendResponse(res, posts);
		} catch (error: any) {
			return this.handleError(res, error);
		}
	}
}
