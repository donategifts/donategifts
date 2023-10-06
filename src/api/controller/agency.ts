import { NextFunction, Request, Response } from 'express';
import { Kysely } from 'kysely';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import { DB } from '../../db/types/generated/database';

import BaseController from './basecontroller';

export default class AgencyController extends BaseController {
	private agencyRepository: AgenciesRepository;

	constructor(database: Kysely<DB>) {
		super();

		this.agencyRepository = new AgenciesRepository(database);
		this.handleGetDetails = this.handleGetDetails.bind(this);
	}

	async handleGetDetails(req: Request, res: Response, _next: NextFunction) {
		try {
			const agency = await this.agencyRepository.getById(req.params.agencyId);

			return this.sendResponse(res, agency);
		} catch (error) {
			this.log.error('[AgencyController] getAgency: ', error);

			return this.handleError(res, error);
		}
	}
}
