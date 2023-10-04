import { NextFunction, Request, Response } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';

import BaseController from './basecontroller';

export default class AdminController extends BaseController {
	private agencyRepository: AgencyRepository;
	constructor() {
		super();

		this.agencyRepository = new AgencyRepository();

		this.handleGetAgencyOverview = this.handleGetAgencyOverview.bind(this);
		this.handleGetAgencyDetail = this.handleGetAgencyDetail.bind(this);
	}

	async handleGetAgencyOverview(_req: Request, res: Response, _next: NextFunction) {
		try {
			const agencies = await this.agencyRepository.getUnverifiedAgencies();

			return this.sendResponse(res, agencies);
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleGetAgencyDetail(req: Request, res: Response, _next: NextFunction) {
		try {
			const agency = await this.agencyRepository.getAgencyById(req.params.agencyId);

			return this.sendResponse(res, agency);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
