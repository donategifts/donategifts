import { NextFunction, Request, Response } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';

import BaseController from './basecontroller';

export default class AgencyController extends BaseController {
	private agencyRepository: AgencyRepository;

	constructor() {
		super();

		this.agencyRepository = new AgencyRepository();
		this.getAgency = this.getAgency.bind(this);
	}

	async getAgency(_req: Request, res: Response, _next: NextFunction) {
		try {
			const agency = await this.agencyRepository.getAgencyByUserId(res.locals.user._id);

			if (!agency) {
				return this.handleError(res, 'Agency could not be found');
			}

			this.sendResponse(res, agency);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
