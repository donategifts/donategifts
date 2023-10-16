import { NextFunction, Request, Response } from 'express';

import BaseController from './basecontroller';

export default class AdminController extends BaseController {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handleGetWishcardsAdministration = this.handleGetWishcardsAdministration.bind(this);
		this.handleGetAgencyOverview = this.handleGetAgencyOverview.bind(this);
		this.handleGetAgencyDetail = this.handleGetAgencyDetail.bind(this);
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'admin/index');
	}

	async handleGetWishcardsAdministration(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'admin/wishcardsadministration');
	}

	async handleGetAgencyOverview(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'admin/agency/overview');
	}

	async handleGetAgencyDetail(req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'admin/agency/detail', { agencyId: req.params.agencyId });
	}
}
