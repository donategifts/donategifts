import { NextFunction, Request, Response } from 'express';

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
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		try {
			const posts = (await this.postRepository.getAllPostsByVerifiedAgencies()).sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
			);
			this.renderView(res, 'pages/community', { posts });
		} catch (error: any) {
			return this.handleError(res, error);
		}
	}
}
