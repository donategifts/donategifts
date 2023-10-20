// TODO: refactored -> /src/api/controller/community.ts

import { NextFunction, Request, Response } from 'express';

import BaseController from './basecontroller';

export default class CommunityController extends BaseController {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		return this.renderView(res, 'pages/community');
	}
}
