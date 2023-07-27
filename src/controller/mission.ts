import { NextFunction, Response, Request } from 'express';

import BaseController from './basecontroller';

export default class Mission extends BaseController {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'mission');
	}
}
